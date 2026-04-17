export type ProgramaCategoria =
  | "capacitacao"
  | "empregabilidade"
  | "inclusao"
  | "sustentabilidade"
  | "educacao"
  | "reciclagem"
  | "genero-raca";

export interface Programa {
  id: string;
  nome: string;
  descricao: string;
  categorias: ProgramaCategoria[];
  tag: string;
}

export const programas: Programa[] = [
  {
    id: "petrobras-socioambiental",
    nome: "Programa Petrobras Socioambiental",
    descricao:
      "Apoia projetos socioambientais que promovem inclusão produtiva, geração de renda e proteção da biodiversidade em comunidades brasileiras.",
    categorias: ["inclusao", "sustentabilidade"],
    tag: "Socioambiental",
  },
  {
    id: "diversa",
    nome: "Programa DiverSa",
    descricao:
      "Iniciativa de Diversidade, Equidade e Inclusão que fortalece grupos sub-representados por meio de capacitação, mentoria e empregabilidade.",
    categorias: ["inclusao", "empregabilidade"],
    tag: "Diversidade",
  },
  {
    id: "pro-equidade",
    nome: "Programa Pró-Equidade de Gênero e Raça",
    descricao:
      "Promove igualdade de oportunidades entre mulheres, homens e pessoas negras no ambiente corporativo e nas cadeias produtivas.",
    categorias: ["genero-raca", "inclusao"],
    tag: "Equidade",
  },
  {
    id: "autonomia-renda",
    nome: "Programa Autonomia e Renda",
    descricao:
      "Capacitação profissional e geração de renda para pessoas em situação de vulnerabilidade, com foco em autonomia financeira.",
    categorias: ["capacitacao", "empregabilidade"],
    tag: "Capacitação",
  },
  {
    id: "semeando-bem-viver",
    nome: "Semeando o Bem Viver",
    descricao:
      "Fortalece a agricultura familiar e práticas sustentáveis, promovendo segurança alimentar e desenvolvimento comunitário.",
    categorias: ["sustentabilidade", "inclusao"],
    tag: "Sustentabilidade",
  },
  {
    id: "eu-sou-catador",
    nome: "Eu Sou Catador",
    descricao:
      "Valoriza catadoras e catadores de materiais recicláveis, com formação, equipamentos e fortalecimento de cooperativas.",
    categorias: ["reciclagem", "empregabilidade"],
    tag: "Reciclagem",
  },
  {
    id: "qualifica-ouro-verde",
    nome: "Qualifica Ouro Verde",
    descricao:
      "Qualificação profissional voltada à bioeconomia, com foco em jovens e adultos em regiões de alta diversidade ambiental.",
    categorias: ["capacitacao", "empregabilidade", "sustentabilidade"],
    tag: "Bioeconomia",
  },
  {
    id: "hortas-organicas",
    nome: "Hortas Orgânicas em Faixas de Dutos",
    descricao:
      "Aproveita áreas de faixas de dutos para hortas orgânicas comunitárias, gerando renda e segurança alimentar.",
    categorias: ["sustentabilidade", "inclusao"],
    tag: "Agricultura",
  },
  {
    id: "aeva",
    nome: "AEVA — Esporte, Educação e Inclusão",
    descricao:
      "Atividades esportivas e educacionais que promovem inclusão social de crianças, jovens e pessoas com deficiência.",
    categorias: ["educacao", "inclusao"],
    tag: "Educação",
  },
];

export interface RespostasExterno {
  nome: string;
  pronome: string;
  pcd: "sim" | "nao" | "prefiro-nao-informar" | "";
  necessidade: string;
  comunicacao: "texto" | "audio" | "ambos" | "";
  objetivo:
    | "capacitacao"
    | "empregabilidade"
    | "inclusao"
    | "sustentabilidade"
    | "educacao"
    | "outro"
    | "";
  objetivoOutro?: string;
}

export const matchProgramas = (r: RespostasExterno): Programa[] => {
  const cats = new Set<ProgramaCategoria>();

  switch (r.objetivo) {
    case "capacitacao":
    case "empregabilidade":
      cats.add("capacitacao");
      cats.add("empregabilidade");
      break;
    case "inclusao":
      cats.add("inclusao");
      break;
    case "sustentabilidade":
      cats.add("sustentabilidade");
      break;
    case "educacao":
      cats.add("educacao");
      break;
    default:
      cats.add("inclusao");
  }

  const necessidade = r.necessidade.toLowerCase();
  if (/recicla|catador|residuo|resíduo|lixo/.test(necessidade)) cats.add("reciclagem");
  if (/gener|gênero|raça|raca|mulher|negr/.test(necessidade)) cats.add("genero-raca");
  if (/educa|escola|estud/.test(necessidade)) cats.add("educacao");

  const ranked = programas
    .map((p) => ({
      p,
      score: p.categorias.filter((c) => cats.has(c)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score > 0);

  const top = ranked.slice(0, 3).map((x) => x.p);
  // Fallback: garantir ao menos 2 programas
  if (top.length < 2) {
    for (const p of programas) {
      if (!top.includes(p)) top.push(p);
      if (top.length >= 3) break;
    }
  }
  return top;
};

export const resumoIA = (r: RespostasExterno): string => {
  const partes: string[] = [];
  partes.push(`Você prefere ser chamado(a) de **${r.nome || "—"}**`);
  if (r.pronome.trim()) partes.push(`utiliza o pronome **${r.pronome}**`);
  if (r.pcd === "sim") partes.push("identifica-se como pessoa com deficiência");
  else if (r.pcd === "nao") partes.push("não se identifica como PCD");
  else if (r.pcd === "prefiro-nao-informar") partes.push("preferiu não informar sobre PCD");

  if (r.necessidade.trim())
    partes.push(`relatou a seguinte necessidade de acessibilidade ou suporte: *"${r.necessidade.trim()}"*`);

  if (r.comunicacao) {
    const map = { texto: "texto", audio: "áudio", ambos: "texto e áudio" } as const;
    partes.push(`prefere se comunicar por **${map[r.comunicacao]}**`);
  }

  const objetivos: Record<string, string> = {
    capacitacao: "capacitação profissional",
    empregabilidade: "empregabilidade",
    inclusao: "inclusão social",
    sustentabilidade: "sustentabilidade",
    educacao: "educação",
    outro: r.objetivoOutro || "outro objetivo",
  };
  if (r.objetivo) partes.push(`e busca **${objetivos[r.objetivo]}**`);

  return partes.join(", ") + ".";
};
