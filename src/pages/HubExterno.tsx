import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  Pencil,
  ArrowLeft,
  ArrowRight,
  Heart,
  Accessibility,
} from "lucide-react";
import { BRLogo } from "@/components/BRLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  matchProgramas,
  resumoIA,
  programas as todosProgramas,
  type Programa,
  type RespostasExterno,
} from "@/data/programasExternos";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Step =
  | "nome"
  | "pronome"
  | "pcd"
  | "necessidade"
  | "comunicacao"
  | "objetivo"
  | "resumo"
  | "recomendacao"
  | "plano";

interface Msg {
  id: string;
  from: "ia" | "user";
  text: string;
  ts: number;
}

const STEPS_ORDER: Step[] = [
  "nome",
  "pronome",
  "pcd",
  "necessidade",
  "comunicacao",
  "objetivo",
  "resumo",
  "recomendacao",
  "plano",
];

const initialRespostas: RespostasExterno = {
  nome: "",
  pronome: "",
  pcd: "",
  necessidade: "",
  comunicacao: "",
  objetivo: "",
  objetivoOutro: "",
};

const HubExterno = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState<Step>("nome");
  const [respostas, setRespostas] = useState<RespostasExterno>(initialRespostas);
  const [input, setInput] = useState("");
  const [recomendados, setRecomendados] = useState<Programa[]>([]);
  const [justificativas, setJustificativas] = useState<Record<string, string>>({});
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Mensagem inicial
  useEffect(() => {
    pushIA([
      "Olá! Seja muito bem-vindo(a) ao **Hub de Inclusão Petrobras**. 💚",
      "Quero entender como podemos adaptar melhor as oportunidades para você. Vamos conversar?",
      "Para começar, **como você gostaria de ser chamado(a)?**",
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushIA = (texts: string[]) => {
    setTyping(true);
    let delay = 400;
    texts.forEach((t, i) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: `ia-${Date.now()}-${i}-${Math.random()}`, from: "ia", text: t, ts: Date.now() },
        ]);
        if (i === texts.length - 1) setTyping(false);
      }, delay);
      delay += 600;
    });
  };

  const pushIAImediato = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `ia-${Date.now()}-${Math.random()}`, from: "ia", text, ts: Date.now() },
    ]);
  };

  const pushUser = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, from: "user", text, ts: Date.now() },
    ]);
  };

  // Chama a edge function hub-externo-ai
  const callIA = async <T,>(action: "resumo" | "recomendacao", body: object): Promise<T | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("hub-externo-ai", {
        body: { action, ...body },
      });
      if (error) {
        console.error(`IA ${action} error:`, error);
        const status = (error as { context?: { status?: number } })?.context?.status;
        if (status === 429) {
          toast({
            title: "Muitas requisições",
            description: "Aguarde um instante e tente novamente.",
            variant: "destructive",
          });
        } else if (status === 402) {
          toast({
            title: "Créditos da IA esgotados",
            description: "Adicione créditos no workspace Lovable para continuar.",
            variant: "destructive",
          });
        }
        return null;
      }
      return data as T;
    } catch (e) {
      console.error(`IA ${action} exception:`, e);
      return null;
    }
  };

  const advance = (next: Step, novasRespostas: RespostasExterno) => {
    setStep(next);
    switch (next) {
      case "pronome":
        pushIA([
          `Prazer em te conhecer, **${novasRespostas.nome}**! 🌱`,
          "Você possui algum **pronome de preferência**? (esse campo é opcional — pode pular se quiser)",
        ]);
        break;
      case "pcd":
        pushIA([
          "Obrigada por compartilhar.",
          "Você se identifica como uma **pessoa com deficiência (PCD)**?",
        ]);
        break;
      case "necessidade":
        pushIA([
          "Combinado.",
          "Você possui alguma **necessidade específica de acessibilidade ou suporte** que possamos considerar? (pode descrever com suas próprias palavras)",
        ]);
        break;
      case "comunicacao":
        pushIA(["Anotado. ✍️", "**Como você prefere se comunicar?**"]);
        break;
      case "objetivo":
        pushIA(["Quase lá!", "**Qual é o seu principal objetivo hoje?**"]);
        break;
      case "resumo": {
        // Mensagem inicial enquanto a IA processa
        pushIA([
          "Perfeito! Deixa eu organizar o que entendi sobre você... 🤖✨",
        ]);
        // Chama IA real (com fallback)
        (async () => {
          const data = await callIA<{ resumo: string }>("resumo", { respostas: novasRespostas });
          const resumo = data?.resumo || resumoIA(novasRespostas);
          // Pequeno atraso para parecer fluído
          setTyping(true);
          setTimeout(() => {
            pushIAImediato("**Confirme se entendi corretamente suas necessidades:**");
            setTimeout(() => {
              pushIAImediato(resumo);
              setTimeout(() => {
                pushIAImediato("Está tudo certo?");
                setTyping(false);
              }, 500);
            }, 500);
          }, 1200);
        })();
        break;
      }
      case "recomendacao": {
        pushIA([
          "Maravilha! Analisando seu perfil em nossa base de programas... 🔍",
        ]);
        (async () => {
          const programasPayload = todosProgramas.map((p) => ({
            id: p.id,
            nome: p.nome,
            descricao: p.descricao,
            tag: p.tag,
            categorias: p.categorias,
          }));
          const data = await callIA<{
            mensagemAbertura: string;
            recomendacoes: { id: string; justificativa: string }[];
          }>("recomendacao", { respostas: novasRespostas, programas: programasPayload });

          let progs: Programa[];
          let abertura: string;
          const justifMap: Record<string, string> = {};

          if (data?.recomendacoes?.length) {
            progs = data.recomendacoes
              .map((r) => {
                const p = todosProgramas.find((pp) => pp.id === r.id);
                if (p) justifMap[p.id] = r.justificativa;
                return p;
              })
              .filter((p): p is Programa => Boolean(p));
            abertura =
              data.mensagemAbertura ||
              `Com base no seu perfil, encontramos **${progs.length} oportunidades** ideais para você:`;
          } else {
            // Fallback determinístico
            progs = matchProgramas(novasRespostas);
            abertura = `Com base no seu perfil, encontramos **${progs.length} oportunidades** ideais para você:`;
          }

          setJustificativas(justifMap);
          setRecomendados(progs);
          setTyping(true);
          setTimeout(() => {
            pushIAImediato(abertura);
            setTyping(false);
            // Avança para plano após pequena pausa
            setTimeout(() => advance("plano", novasRespostas), 1500);
          }, 1000);
        })();
        break;
      }
      case "plano":
        pushIA([
          "Esses são seus **próximos passos** para iniciar sua jornada conosco. 🚀",
        ]);
        break;
    }
  };

  // ===== Handlers =====
  const handleSendText = () => {
    const value = input.trim();
    if (!value) return;
    setInput("");

    if (step === "nome") {
      pushUser(value);
      const nova = { ...respostas, nome: value };
      setRespostas(nova);
      advance("pronome", nova);
    } else if (step === "pronome") {
      pushUser(value);
      const nova = { ...respostas, pronome: value };
      setRespostas(nova);
      advance("pcd", nova);
    } else if (step === "necessidade") {
      pushUser(value);
      const nova = { ...respostas, necessidade: value };
      setRespostas(nova);
      advance("comunicacao", nova);
    } else if (step === "objetivo") {
      // caso "Outro"
      pushUser(value);
      const nova = { ...respostas, objetivoOutro: value, objetivo: "outro" as const };
      setRespostas(nova);
      advance("resumo", nova);
    }
  };

  const handlePulaPronome = () => {
    pushUser("Prefiro não informar");
    const nova = { ...respostas, pronome: "" };
    setRespostas(nova);
    advance("pcd", nova);
  };

  const handlePCD = (val: "sim" | "nao" | "prefiro-nao-informar", label: string) => {
    pushUser(label);
    const nova = { ...respostas, pcd: val };
    setRespostas(nova);
    advance("necessidade", nova);
  };

  const handleSemNecessidade = () => {
    pushUser("Não tenho necessidade específica no momento");
    const nova = { ...respostas, necessidade: "" };
    setRespostas(nova);
    advance("comunicacao", nova);
  };

  const handleComunicacao = (val: "texto" | "audio" | "ambos", label: string) => {
    pushUser(label);
    const nova = { ...respostas, comunicacao: val };
    setRespostas(nova);
    advance("objetivo", nova);
  };

  const handleObjetivo = (
    val: RespostasExterno["objetivo"],
    label: string,
  ) => {
    pushUser(label);
    if (val === "outro") {
      setStep("objetivo"); // mantém para usar input
      pushIA(["Conta pra mim em poucas palavras: **qual é esse objetivo?**"]);
      setRespostas({ ...respostas, objetivo: "outro" });
      return;
    }
    const nova = { ...respostas, objetivo: val };
    setRespostas(nova);
    advance("resumo", nova);
  };

  const handleConfirmar = () => {
    pushUser("Sim, está correto ✅");
    // O case "recomendacao" já avança para "plano" após receber a resposta da IA
    advance("recomendacao", respostas);
  };

  const handleEditar = () => {
    pushUser("Quero editar minhas respostas");
    setRespostas(initialRespostas);
    setRecomendados([]);
    setJustificativas({});
    setMessages([]);
    setStep("nome");
    setTimeout(() => {
      pushIA([
        "Sem problemas! Vamos recomeçar do zero. 🔄",
        "Para começar, **como você gostaria de ser chamado(a)?**",
      ]);
    }, 300);
  };

  const stepIndex = STEPS_ORDER.indexOf(step);
  const progresso = Math.round((stepIndex / (STEPS_ORDER.length - 1)) * 100);

  const inputAtivo = ["nome", "pronome", "necessidade"].includes(step) ||
    (step === "objetivo" && respostas.objetivo === "outro");

  return (
    <main className="min-h-screen bg-gradient-to-br from-success/5 via-background to-accent/10 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/90 backdrop-blur-sm sticky top-0 z-30">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <BRLogo size={36} variant="dark" />
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground text-base">Hub de Inclusão</span>
                <Sparkles className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                Petrobras · Acesso Externo
              </span>
            </div>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-base"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>
        {/* Barra de progresso */}
        <div className="container pb-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Accessibility className="h-3.5 w-3.5 text-success" />
              Conversa com a IA inclusiva
            </span>
            <span>{progresso}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success to-accent transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </header>

      {/* Chat */}
      <section className="flex-1 flex flex-col container max-w-3xl py-6">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 pr-1"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((m) => (
            <Bubble key={m.id} from={m.from} text={m.text} />
          ))}
          {typing && <TypingBubble />}

          {/* Botões contextuais */}
          {!typing && step === "pronome" && (
            <ChoicesRow>
              <ChoiceBtn onClick={handlePulaPronome} variant="ghost">
                Prefiro não informar
              </ChoiceBtn>
            </ChoicesRow>
          )}

          {!typing && step === "pcd" && (
            <ChoicesRow>
              <ChoiceBtn onClick={() => handlePCD("sim", "Sim")}>Sim</ChoiceBtn>
              <ChoiceBtn onClick={() => handlePCD("nao", "Não")}>Não</ChoiceBtn>
              <ChoiceBtn
                onClick={() => handlePCD("prefiro-nao-informar", "Prefiro não informar")}
                variant="ghost"
              >
                Prefiro não informar
              </ChoiceBtn>
            </ChoicesRow>
          )}

          {!typing && step === "necessidade" && (
            <ChoicesRow>
              <ChoiceBtn onClick={handleSemNecessidade} variant="ghost">
                Não tenho no momento
              </ChoiceBtn>
            </ChoicesRow>
          )}

          {!typing && step === "comunicacao" && (
            <ChoicesRow>
              <ChoiceBtn onClick={() => handleComunicacao("texto", "Texto")}>Texto</ChoiceBtn>
              <ChoiceBtn onClick={() => handleComunicacao("audio", "Áudio")}>Áudio</ChoiceBtn>
              <ChoiceBtn onClick={() => handleComunicacao("ambos", "Ambos")}>Ambos</ChoiceBtn>
            </ChoicesRow>
          )}

          {!typing && step === "objetivo" && respostas.objetivo !== "outro" && (
            <ChoicesRow>
              <ChoiceBtn onClick={() => handleObjetivo("capacitacao", "Capacitação profissional")}>
                Capacitação profissional
              </ChoiceBtn>
              <ChoiceBtn onClick={() => handleObjetivo("empregabilidade", "Empregabilidade")}>
                Empregabilidade
              </ChoiceBtn>
              <ChoiceBtn onClick={() => handleObjetivo("inclusao", "Inclusão social")}>
                Inclusão social
              </ChoiceBtn>
              <ChoiceBtn onClick={() => handleObjetivo("sustentabilidade", "Sustentabilidade")}>
                Sustentabilidade
              </ChoiceBtn>
              <ChoiceBtn onClick={() => handleObjetivo("educacao", "Educação")}>
                Educação
              </ChoiceBtn>
              <ChoiceBtn onClick={() => handleObjetivo("outro", "Outro")} variant="ghost">
                Outro
              </ChoiceBtn>
            </ChoicesRow>
          )}

          {!typing && step === "resumo" && (
            <ChoicesRow>
              <Button
                onClick={handleConfirmar}
                className="bg-success text-primary-foreground hover:bg-success/90 gap-2"
              >
                <CheckCircle2 className="h-4 w-4" /> Confirmar
              </Button>
              <Button onClick={handleEditar} variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" /> Editar respostas
              </Button>
            </ChoicesRow>
          )}

          {/* Recomendações */}
          {!typing && (step === "recomendacao" || step === "plano") && recomendados.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3 mt-2 animate-fade-in">
              {recomendados.map((p) => (
                <ProgramaCard key={p.id} programa={p} />
              ))}
            </div>
          )}

          {/* Plano de ação */}
          {!typing && step === "plano" && (
            <Card className="p-5 border-success/30 bg-success/5 animate-fade-in mt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-success" />
                </div>
                <h3 className="font-bold text-foreground">Próximos passos</h3>
              </div>
              <ol className="space-y-2.5 text-sm text-foreground/90">
                <PlanoItem n={1}>Inscreva-se no programa recomendado</PlanoItem>
                <PlanoItem n={2}>Aguarde o contato da equipe Petrobras</PlanoItem>
                <PlanoItem n={3}>Inicie sua jornada de inclusão e oportunidades 🌱</PlanoItem>
              </ol>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={handleEditar}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Pencil className="h-3.5 w-3.5" /> Refazer triagem
                </Button>
                <Link to="/">
                  <Button size="sm" variant="ghost" className="gap-2">
                    Voltar ao início <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Input */}
        <div className="mt-4 pt-3 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!inputAtivo}
              placeholder={
                inputAtivo
                  ? "Digite sua resposta..."
                  : "Use os botões acima para responder"
              }
              className="flex-1"
              aria-label="Mensagem para a IA"
            />
            <Button
              type="submit"
              disabled={!inputAtivo || !input.trim()}
              className="bg-success text-primary-foreground hover:bg-success/90 gap-2"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Enviar</span>
            </Button>
          </form>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">
            🤖 Esta é uma simulação de IA inclusiva · Suas respostas não são armazenadas
          </p>
        </div>
      </section>
    </main>
  );
};

// ============ Sub-componentes ============

const Bubble = ({ from, text }: { from: "ia" | "user"; text: string }) => {
  const isIA = from === "ia";
  return (
    <div className={`flex gap-2.5 animate-fade-in ${isIA ? "justify-start" : "justify-end"}`}>
      {isIA && (
        <div className="h-8 w-8 rounded-full bg-success/15 flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="h-4 w-4 text-success" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isIA
            ? "bg-card border border-border text-foreground rounded-tl-sm"
            : "bg-success text-primary-foreground rounded-tr-sm"
        }`}
      >
        <FormattedText text={text} />
      </div>
      {!isIA && (
        <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center shrink-0 mt-0.5">
          <User className="h-4 w-4 text-accent-foreground" />
        </div>
      )}
    </div>
  );
};

const FormattedText = ({ text }: { text: string }) => {
  // Renderiza **negrito** e *itálico* simples
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <span className="whitespace-pre-wrap break-words">
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.endsWith("*"))
          return <em key={i}>{p.slice(1, -1)}</em>;
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
};

const TypingBubble = () => (
  <div className="flex gap-2.5 justify-start animate-fade-in">
    <div className="h-8 w-8 rounded-full bg-success/15 flex items-center justify-center shrink-0 mt-0.5">
      <Bot className="h-4 w-4 text-success" />
    </div>
    <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-success/60 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 rounded-full bg-success/60 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 rounded-full bg-success/60 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  </div>
);

const ChoicesRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-2 pl-10 animate-fade-in">{children}</div>
);

const ChoiceBtn = ({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "ghost";
}) => (
  <Button
    onClick={onClick}
    variant={variant === "ghost" ? "outline" : "default"}
    size="sm"
    className={
      variant === "default"
        ? "bg-success/10 hover:bg-success/20 text-success border border-success/30 hover:border-success/50 transition-base"
        : "border-dashed text-muted-foreground hover:text-foreground"
    }
  >
    {children}
  </Button>
);

const ProgramaCard = ({ programa }: { programa: Programa }) => (
  <Card className="p-4 border-border hover:border-success/40 hover:shadow-elegant transition-base group">
    <div className="flex items-start justify-between mb-2 gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/20 text-accent-foreground">
        {programa.tag}
      </span>
      <Sparkles className="h-3.5 w-3.5 text-success opacity-70" />
    </div>
    <h4 className="font-bold text-foreground text-sm leading-tight mb-2">
      {programa.nome}
    </h4>
    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
      {programa.descricao}
    </p>
    <Button
      size="sm"
      variant="outline"
      className="w-full text-xs gap-1.5 group-hover:bg-success group-hover:text-primary-foreground group-hover:border-success transition-base"
    >
      Saiba mais <ArrowRight className="h-3 w-3" />
    </Button>
  </Card>
);

const PlanoItem = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className="h-6 w-6 rounded-full bg-success text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
      {n}
    </span>
    <span className="pt-0.5">{children}</span>
  </li>
);

export default HubExterno;
