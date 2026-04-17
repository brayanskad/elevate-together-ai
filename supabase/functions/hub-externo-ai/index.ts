// Edge Function: hub-externo-ai
// Gera resumo inclusivo e recomendações de programas via Lovable AI Gateway.
// Ações suportadas: { action: "resumo" | "recomendacao", respostas, programas? }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

interface Respostas {
  nome?: string;
  pronome?: string;
  pcd?: string;
  necessidade?: string;
  comunicacao?: string;
  objetivo?: string;
  objetivoOutro?: string;
}

interface ProgramaIn {
  id: string;
  nome: string;
  descricao: string;
  tag?: string;
  categorias?: string[];
}

const SYSTEM_PROMPT = `Você é um assistente de IA inclusiva do Hub de Inclusão Petrobras.
- Tom: acolhedor, humano, empático e profissional.
- Linguagem: SEMPRE inclusiva e não-capacitista. Evite termos como "deficiente", "portador", "sofre de", "vítima de", "especial". Use "pessoa com deficiência (PcD)", "pessoa surda", "pessoa cega", "pessoa com baixa visão" etc.
- Foque em ADAPTAÇÃO DO AMBIENTE, nunca em limitação da pessoa.
- Respeite pronomes informados.
- Português do Brasil.
- Nunca invente dados que o usuário não forneceu.`;

const tools = [
  {
    type: "function",
    function: {
      name: "gerar_resumo_inclusivo",
      description:
        "Gera um resumo curto, inclusivo e em primeira/segunda pessoa interpretando o perfil do usuário externo.",
      parameters: {
        type: "object",
        properties: {
          resumo: {
            type: "string",
            description:
              "Resumo em 2-3 frases, em segunda pessoa ('Você...'), com markdown leve (**negrito** em palavras-chave). Não use listas.",
          },
        },
        required: ["resumo"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "recomendar_programas",
      description:
        "Seleciona de 2 a 3 programas ideais a partir da lista fornecida, com justificativa personalizada para cada um.",
      parameters: {
        type: "object",
        properties: {
          recomendacoes: {
            type: "array",
            minItems: 2,
            maxItems: 3,
            items: {
              type: "object",
              properties: {
                id: { type: "string", description: "ID exato do programa, conforme a lista" },
                justificativa: {
                  type: "string",
                  description:
                    "1 frase curta e personalizada (até 140 caracteres) explicando o match com o perfil.",
                },
              },
              required: ["id", "justificativa"],
              additionalProperties: false,
            },
          },
          mensagemAbertura: {
            type: "string",
            description:
              "Frase acolhedora introduzindo as recomendações (1 frase, até 160 caracteres).",
          },
        },
        required: ["recomendacoes", "mensagemAbertura"],
        additionalProperties: false,
      },
    },
  },
];

const callGateway = async (body: unknown) => {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY ausente");

  const r = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return r;
};

const errorResponse = (status: number, message: string) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") return errorResponse(400, "Payload inválido");

    const { action, respostas, programas } = payload as {
      action?: string;
      respostas?: Respostas;
      programas?: ProgramaIn[];
    };

    if (!action || !respostas) return errorResponse(400, "Campos obrigatórios: action, respostas");

    // ===== RESUMO =====
    if (action === "resumo") {
      const userPrompt = `Gere um resumo inclusivo do perfil do usuário a partir destas respostas:

- Nome/como gostaria de ser chamado: ${respostas.nome || "(não informado)"}
- Pronome de preferência: ${respostas.pronome || "(não informado)"}
- Identifica-se como PcD: ${respostas.pcd || "(não informado)"}
- Necessidade de acessibilidade/suporte: ${respostas.necessidade || "(nenhuma informada)"}
- Forma preferida de comunicação: ${respostas.comunicacao || "(não informada)"}
- Objetivo principal: ${respostas.objetivo === "outro" ? respostas.objetivoOutro : respostas.objetivo || "(não informado)"}

Reformule qualquer linguagem inadequada, foque na adaptação do ambiente, e fale em segunda pessoa ("Você prefere...").`;

      const r = await callGateway({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "gerar_resumo_inclusivo" } },
      });

      if (r.status === 429) return errorResponse(429, "Limite de requisições atingido. Tente novamente em instantes.");
      if (r.status === 402) return errorResponse(402, "Créditos da IA esgotados. Adicione créditos no workspace Lovable.");
      if (!r.ok) {
        const t = await r.text();
        console.error("AI gateway resumo error:", r.status, t);
        return errorResponse(500, "Falha ao gerar resumo");
      }

      const data = await r.json();
      const call = data?.choices?.[0]?.message?.tool_calls?.[0];
      const args = call?.function?.arguments ? JSON.parse(call.function.arguments) : null;
      if (!args?.resumo) return errorResponse(500, "Resposta da IA sem resumo");

      return new Response(JSON.stringify({ resumo: args.resumo }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ===== RECOMENDACAO =====
    if (action === "recomendacao") {
      if (!Array.isArray(programas) || programas.length === 0)
        return errorResponse(400, "Lista de programas é obrigatória para recomendação");

      const listaProgramas = programas
        .map(
          (p) =>
            `- ID: ${p.id} | Nome: ${p.nome} | Categorias: ${(p.categorias || []).join(", ")} | ${p.descricao}`,
        )
        .join("\n");

      const userPrompt = `Perfil do usuário:
- Como gostaria de ser chamado: ${respostas.nome || "(não informado)"}
- Pronome: ${respostas.pronome || "(não informado)"}
- PcD: ${respostas.pcd || "(não informado)"}
- Necessidade de acessibilidade: ${respostas.necessidade || "(nenhuma)"}
- Comunicação preferida: ${respostas.comunicacao || "(não informada)"}
- Objetivo principal: ${respostas.objetivo === "outro" ? respostas.objetivoOutro : respostas.objetivo || "(não informado)"}

Programas disponíveis (use APENAS estes IDs):
${listaProgramas}

Selecione de 2 a 3 programas que mais combinam com o perfil. Personalize a justificativa de cada um citando algo do perfil. Cite o nome da pessoa na mensagem de abertura quando disponível.`;

      const r = await callGateway({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "recomendar_programas" } },
      });

      if (r.status === 429) return errorResponse(429, "Limite de requisições atingido. Tente novamente em instantes.");
      if (r.status === 402) return errorResponse(402, "Créditos da IA esgotados. Adicione créditos no workspace Lovable.");
      if (!r.ok) {
        const t = await r.text();
        console.error("AI gateway recomendacao error:", r.status, t);
        return errorResponse(500, "Falha ao gerar recomendações");
      }

      const data = await r.json();
      const call = data?.choices?.[0]?.message?.tool_calls?.[0];
      const args = call?.function?.arguments ? JSON.parse(call.function.arguments) : null;
      if (!args?.recomendacoes?.length) return errorResponse(500, "Resposta da IA sem recomendações");

      // Filtra para garantir que só IDs válidos passem
      const idsValidos = new Set(programas.map((p) => p.id));
      const recomendacoes = (args.recomendacoes as Array<{ id: string; justificativa: string }>)
        .filter((x) => idsValidos.has(x.id))
        .slice(0, 3);

      return new Response(
        JSON.stringify({
          mensagemAbertura: args.mensagemAbertura || "",
          recomendacoes,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return errorResponse(400, `Ação desconhecida: ${action}`);
  } catch (e) {
    console.error("hub-externo-ai error:", e);
    return errorResponse(500, e instanceof Error ? e.message : "Erro desconhecido");
  }
});
