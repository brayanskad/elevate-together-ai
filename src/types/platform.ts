export type AccessType = "interno" | "externo";

export type DemandStatus = "novo" | "em-analise" | "encaminhado" | "resolvido";

export type DemandCategory =
  | "Mobilidade"
  | "Comunicação"
  | "Tecnologia"
  | "Ambiente Físico"
  | "Cultural / Atitudinal"
  | "Processos";

export type ActionType =
  | "Adaptação rápida"
  | "Solução estrutural"
  | "Treinamento"
  | "Política / Norma"
  | "Reaproveitamento";

export interface Classification {
  tipoNecessidade: string;
  categoria: DemandCategory;
  tipoAtuacao: ActionType;
  contexto: string;
}

export interface Demand {
  id: string;
  protocolo: string;
  resumo: string;
  origem: AccessType;
  classificacao: Classification;
  acaoSugerida: string;
  reaproveitamento?: { id: string; titulo: string; similaridade: number };
  alertaBoasPraticas?: string;
  status: DemandStatus;
  area: string;
  criadoEm: string;
  agrupamento?: string;
}

export interface ChatMessage {
  id: string;
  role: "bot" | "user" | "system";
  content: string;
  reformulado?: { original: string; sugestao: string };
}
