import { Demand } from "@/types/platform";

export const mockDemands: Demand[] = [
  {
    id: "1",
    protocolo: "ACS-2025-0142",
    resumo:
      "Colaborador relata que a sala de reuniões do 12º andar não possui sinalização tátil nem contraste adequado nos botões do elevador, dificultando a autonomia de pessoas com baixa visão.",
    origem: "interno",
    classificacao: {
      tipoNecessidade: "Visual",
      categoria: "Ambiente Físico",
      tipoAtuacao: "Solução estrutural",
      contexto: "Edifício sede — 12º andar",
    },
    acaoSugerida:
      "Aplicar sinalização tátil e revisar contraste dos painéis. Reaproveitar projeto-piloto do 8º andar.",
    reaproveitamento: {
      id: "ACS-2024-0987",
      titulo: "Sinalização tátil — piloto 8º andar",
      similaridade: 92,
    },
    alertaBoasPraticas:
      "Evite usar termos como 'deficiente visual'. Prefira 'pessoa com deficiência visual'.",
    status: "em-analise",
    area: "Engenharia & Facilities",
    criadoEm: "2025-04-12",
    agrupamento: "Sinalização Sede",
  },
  {
    id: "2",
    protocolo: "ACS-2025-0156",
    resumo:
      "Candidata externa solicita formato acessível para etapa de testes online — necessita compatibilidade com leitor de tela NVDA.",
    origem: "externo",
    classificacao: {
      tipoNecessidade: "Visual",
      categoria: "Tecnologia",
      tipoAtuacao: "Adaptação rápida",
      contexto: "Processo seletivo — Trainee 2025",
    },
    acaoSugerida:
      "Habilitar versão WCAG 2.2 AA da plataforma de testes e enviar manual de navegação por teclado.",
    alertaBoasPraticas: "Confirmar com a candidata o tempo adicional necessário para a prova.",
    status: "encaminhado",
    area: "Recursos Humanos",
    criadoEm: "2025-04-13",
  },
  {
    id: "3",
    protocolo: "ACS-2025-0161",
    resumo:
      "Equipe relata reuniões sem legenda automática, dificultando participação de colega com deficiência auditiva.",
    origem: "interno",
    classificacao: {
      tipoNecessidade: "Auditiva",
      categoria: "Comunicação",
      tipoAtuacao: "Solução estrutural",
      contexto: "Reuniões corporativas — Teams",
    },
    acaoSugerida:
      "Ativar legendas automáticas como padrão organizacional e oferecer intérprete de Libras sob demanda.",
    reaproveitamento: {
      id: "ACS-2024-0712",
      titulo: "Política de legendas — Diretoria E&P",
      similaridade: 88,
    },
    status: "novo",
    area: "Comunicação Interna",
    criadoEm: "2025-04-14",
    agrupamento: "Comunicação Acessível",
  },
  {
    id: "4",
    protocolo: "ACS-2025-0167",
    resumo:
      "Fornecedor solicita orientação sobre padrões de acessibilidade exigidos em entrega de portal web institucional.",
    origem: "externo",
    classificacao: {
      tipoNecessidade: "Múltipla",
      categoria: "Tecnologia",
      tipoAtuacao: "Política / Norma",
      contexto: "Contratação — Portal Sustentabilidade",
    },
    acaoSugerida:
      "Compartilhar guia WCAG 2.2 AA institucional e checklist de homologação. Já existe template aprovado.",
    reaproveitamento: {
      id: "ACS-2024-0455",
      titulo: "Guia de Homologação Digital",
      similaridade: 95,
    },
    status: "resolvido",
    area: "TI & Governança Digital",
    criadoEm: "2025-04-10",
  },
  {
    id: "5",
    protocolo: "ACS-2025-0170",
    resumo:
      "Colaborador relata comentários inadequados em reunião sobre colega com mobilidade reduzida — solicita orientação.",
    origem: "interno",
    classificacao: {
      tipoNecessidade: "Atitudinal",
      categoria: "Cultural / Atitudinal",
      tipoAtuacao: "Treinamento",
      contexto: "Gerência de Operações — Bacia de Campos",
    },
    acaoSugerida:
      "Aplicar trilha de letramento em diversidade e mediação com a liderança da equipe.",
    alertaBoasPraticas:
      "Barreira atitudinal detectada. Considere ação preventiva nas demais equipes da unidade.",
    status: "em-analise",
    area: "Diversidade & Inclusão",
    criadoEm: "2025-04-15",
    agrupamento: "Letramento Inclusivo",
  },
  {
    id: "6",
    protocolo: "ACS-2025-0173",
    resumo:
      "Múltiplos relatos sobre ausência de rampas adequadas no estacionamento da unidade administrativa.",
    origem: "interno",
    classificacao: {
      tipoNecessidade: "Mobilidade",
      categoria: "Ambiente Físico",
      tipoAtuacao: "Solução estrutural",
      contexto: "Unidade administrativa — RJ",
    },
    acaoSugerida:
      "Padrão estrutural identificado. Encaminhar para revisão arquitetônica e priorização orçamentária.",
    status: "novo",
    area: "Engenharia & Facilities",
    criadoEm: "2025-04-15",
    agrupamento: "Sinalização Sede",
  },
];

export const dashboardMetrics = {
  tempoResposta: { valor: "−42%", label: "Redução do tempo de resposta", trend: "down-good" },
  reaproveitamento: { valor: "63%", label: "Reaproveitamento de soluções", trend: "up-good" },
  recorrentes: { valor: "−28%", label: "Demandas repetidas", trend: "down-good" },
  estruturais: { valor: "17", label: "Soluções estruturais geradas", trend: "up-good" },
  adaptacao: { valor: "5,2 dias", label: "Tempo médio de adaptação", trend: "neutral" },
  total: { valor: "184", label: "Demandas no trimestre", trend: "neutral" },
};
