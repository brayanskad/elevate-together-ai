import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BRLogo } from "@/components/BRLogo";
import {
  Lock, ArrowLeft, ArrowRight, Check, HelpCircle, X,
  Accessibility, MessageSquare, Monitor, Heart, Plus, MoreHorizontal,
  Sparkles, AlertCircle
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

type StepDef = {
  id: string;
  pergunta: string;
  tipo: "yesno" | "options";
  opcoes?: { label: string; sub: string; icon: any; bg: string; iconColor: string }[];
};

const stepDefs: StepDef[] = [
  {
    id: "interesse",
    pergunta: "Você gostaria de apoio relacionado a acessibilidade ou inclusão?",
    tipo: "yesno",
  },
  {
    id: "necessidade",
    pergunta: "Qual dessas situações mais se aproxima da sua necessidade?",
    tipo: "options",
    opcoes: [
      { label: "Acesso físico", sub: "Locomoção, estrutura, espaço", icon: Accessibility, bg: "bg-success/15", iconColor: "text-success" },
      { label: "Comunicação", sub: "Intérprete, linguagem", icon: MessageSquare, bg: "bg-info/10", iconColor: "text-info" },
      { label: "Tecnologia", sub: "Sistemas, acessibilidade digital", icon: Monitor, bg: "bg-accent/20", iconColor: "text-accent-foreground" },
      { label: "Ambiente de trabalho", sub: "Respeito, comportamento", icon: Heart, bg: "bg-info/10", iconColor: "text-info" },
      { label: "Saúde / Bem-estar", sub: "Apoio e qualidade de vida", icon: Plus, bg: "bg-destructive/10", iconColor: "text-destructive" },
      { label: "Outro", sub: "Não está listado", icon: MoreHorizontal, bg: "bg-muted", iconColor: "text-muted-foreground" },
    ],
  },
  {
    id: "frequencia",
    pergunta: "Com que frequência você enfrenta essa situação?",
    tipo: "options",
    opcoes: [
      { label: "Diariamente", sub: "Acontece todos os dias", icon: AlertCircle, bg: "bg-destructive/10", iconColor: "text-destructive" },
      { label: "Semanalmente", sub: "Algumas vezes por semana", icon: AlertCircle, bg: "bg-accent/20", iconColor: "text-accent-foreground" },
      { label: "Esporadicamente", sub: "De vez em quando", icon: AlertCircle, bg: "bg-info/10", iconColor: "text-info" },
      { label: "Primeira vez", sub: "Nunca tinha acontecido", icon: AlertCircle, bg: "bg-success/15", iconColor: "text-success" },
    ],
  },
  {
    id: "urgencia",
    pergunta: "Qual o nível de urgência?",
    tipo: "options",
    opcoes: [
      { label: "Alta", sub: "Impede meu trabalho/atividade", icon: AlertCircle, bg: "bg-destructive/10", iconColor: "text-destructive" },
      { label: "Média", sub: "Dificulta, mas consigo seguir", icon: AlertCircle, bg: "bg-accent/20", iconColor: "text-accent-foreground" },
      { label: "Baixa", sub: "É um incômodo pontual", icon: AlertCircle, bg: "bg-success/15", iconColor: "text-success" },
    ],
  },
  {
    id: "contato",
    pergunta: "Como prefere ser contatado(a) pela equipe responsável?",
    tipo: "options",
    opcoes: [
      { label: "E-mail corporativo", sub: "Resposta formal documentada", icon: MessageSquare, bg: "bg-info/10", iconColor: "text-info" },
      { label: "Chat da plataforma", sub: "Conversa rápida e direta", icon: MessageSquare, bg: "bg-success/15", iconColor: "text-success" },
      { label: "Telefone", sub: "Ligação da área responsável", icon: MessageSquare, bg: "bg-accent/20", iconColor: "text-accent-foreground" },
    ],
  },
];

const Triagem = () => {
  const [params] = useSearchParams();
  const tipo = params.get("tipo") || "interno";
  const navigate = useNavigate();

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [yesnoAnswer, setYesnoAnswer] = useState<string | null>(null);

  const total = stepDefs.length;
  const step = stepDefs[stepIdx];
  const progress = ((stepIdx + 1) / total) * 100;
  const currentAnswer = answers[step.id];

  const handleNext = () => {
    if (step.tipo === "yesno" && yesnoAnswer) {
      setAnswers({ ...answers, [step.id]: yesnoAnswer });
    }
    if (stepIdx + 1 < total) {
      setStepIdx(stepIdx + 1);
      setYesnoAnswer(null);
    } else {
      navigate("/demanda/1");
    }
  };

  const handleBack = () => {
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
    } else {
      navigate("/");
    }
  };

  const canContinue = step.tipo === "yesno" ? !!yesnoAnswer : !!currentAnswer;

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-success/5 via-background to-accent/5">
      {/* Decorative curves */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M0,200 Q300,100 600,250 T1200,200" stroke="hsl(158 60% 40%)" strokeWidth="1.5" fill="none" />
        <path d="M0,400 Q400,300 700,500 T1200,420" stroke="hsl(48 96% 53%)" strokeWidth="1.5" fill="none" />
        <path d="M0,600 Q300,520 700,650 T1200,600" stroke="hsl(158 60% 40%)" strokeWidth="1.5" fill="none" />
      </svg>

      <div className="relative container max-w-3xl py-8 md:py-12 animate-fade-in">
        <Card className="p-6 md:p-10 shadow-elegant border border-border/60 rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <BRLogo size={32} variant="dark" />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              Suas respostas são confidenciais
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex gap-1.5 mb-2">
              {stepDefs.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-base ${
                    i <= stepIdx ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-right">
              Passo {stepIdx + 1} de {total}
            </div>
          </div>

          {/* Mascote + título */}
          <div className="flex items-start gap-4 mb-8 pb-6 border-b border-border">
            <div className="relative shrink-0">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-success/20 to-accent/15 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-card shadow-card flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-success" fill="currentColor" />
                </div>
              </div>
              <Sparkles className="absolute -bottom-1 -right-1 h-5 w-5 text-accent" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Assistente de Inclusão</h1>
              <p className="text-muted-foreground mt-1.5 leading-relaxed">
                Vou te fazer algumas perguntas rápidas para te direcionar
                <br className="hidden md:block" /> ao programa ou suporte ideal.
              </p>
            </div>
          </div>

          {/* Pergunta */}
          <div className="space-y-5 animate-fade-in" key={stepIdx}>
            <div className="flex items-start gap-3">
              <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                {stepIdx + 1}
              </span>
              <h2 className="text-lg font-semibold text-foreground leading-snug pt-1">{step.pergunta}</h2>
            </div>

            {step.tipo === "yesno" && (
              <div className="grid grid-cols-3 gap-3 pl-10">
                <YesNoButton selected={yesnoAnswer === "sim"} onClick={() => setYesnoAnswer("sim")} icon={Check} label="Sim" tone="success" />
                <YesNoButton selected={yesnoAnswer === "duvida"} onClick={() => setYesnoAnswer("duvida")} icon={HelpCircle} label="Não tenho certeza" tone="muted" />
                <YesNoButton selected={yesnoAnswer === "nao"} onClick={() => setYesnoAnswer("nao")} icon={X} label="Não" tone="muted" />
              </div>
            )}

            {step.tipo === "options" && step.opcoes && (
              <div className="grid sm:grid-cols-2 gap-3 pl-10">
                {step.opcoes.map((op) => {
                  const selected = currentAnswer === op.label;
                  return (
                    <button
                      key={op.label}
                      onClick={() => setAnswers({ ...answers, [step.id]: op.label })}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-base ${
                        selected
                          ? "border-primary bg-primary/5 shadow-card"
                          : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className={`h-11 w-11 rounded-full ${op.bg} flex items-center justify-center shrink-0`}>
                        <op.icon className={`h-5 w-5 ${op.iconColor}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-foreground">{op.label}</div>
                        <div className="text-xs text-muted-foreground truncate">{op.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Aviso */}
          <Card className="mt-7 p-4 bg-accent/8 border-accent/30 flex items-start gap-3">
            <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center shrink-0">
              <AlertCircle className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Você pode pular perguntas a qualquer momento</div>
              <div className="text-xs text-muted-foreground mt-0.5">As perguntas sobre identidade são opcionais e confidenciais</div>
            </div>
          </Card>

          {/* Footer actions */}
          <div className="flex items-center justify-between mt-7 pt-6 border-t border-border">
            <Button variant="outline" onClick={handleBack} className="gap-2 h-11">
              <ArrowLeft className="h-4 w-4" />
              {stepIdx === 0 ? "Sair" : "Voltar"}
            </Button>
            <Button onClick={handleNext} disabled={!canContinue} className="gap-2 h-11 px-6">
              {stepIdx + 1 === total ? "Concluir" : "Continuar"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
            ← Voltar à tela inicial
          </Link>
        </div>
      </div>
    </main>
  );
};

const YesNoButton = ({
  selected, onClick, icon: Icon, label, tone,
}: { selected: boolean; onClick: () => void; icon: any; label: string; tone: "success" | "muted" }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 h-12 rounded-xl border-2 font-semibold text-sm transition-base ${
      selected
        ? tone === "success"
          ? "border-success bg-success/10 text-success"
          : "border-primary bg-primary/5 text-foreground"
        : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/30"
    }`}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

export default Triagem;
