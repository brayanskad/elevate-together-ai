import { BrandHeader } from "@/components/BrandHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Bot, User, Send, Sparkles, CheckCircle2, AlertTriangle,
  Wand2, Recycle, ArrowRight, Loader2
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

type Step = {
  id: string;
  pergunta: string;
  placeholder: string;
  hint?: string;
};

const steps: Step[] = [
  {
    id: "contexto",
    pergunta: "Olá! 👋 Sou a assistente da InclusivAI. Para começar, em qual contexto a barreira foi identificada?",
    placeholder: "Ex: Sala de reuniões, processo seletivo, plataforma interna...",
    hint: "Foque no AMBIENTE, não na pessoa.",
  },
  {
    id: "descricao",
    pergunta: "Descreva o que está dificultando o acesso ou a participação. Pode ser livre — eu ajudo a organizar.",
    placeholder: "Conte com suas palavras o que aconteceu...",
    hint: "Use linguagem inclusiva. Vou sugerir melhorias se necessário.",
  },
  {
    id: "frequencia",
    pergunta: "Isso acontece com qual frequência?",
    placeholder: "Ex: Diariamente, em reuniões semanais, esporadicamente...",
  },
  {
    id: "impacto",
    pergunta: "Quem é impactado por essa barreira? (sem identificar pessoas)",
    placeholder: "Ex: Equipe da unidade X, candidatos do processo Y...",
  },
];

// Detecção simples de linguagem inadequada (mock IA)
const checkLanguage = (text: string): { sugestao: string; trocas: string[] } | null => {
  const replacements: Record<string, string> = {
    "deficiente": "pessoa com deficiência",
    "portador": "pessoa com",
    "aleijado": "pessoa com deficiência física",
    "mudo": "pessoa surda",
    "surdo-mudo": "pessoa surda",
    "cego": "pessoa com deficiência visual",
    "retardado": "pessoa com deficiência intelectual",
    "normal": "pessoa sem deficiência",
    "especial": "com deficiência",
  };
  let sugestao = text;
  const trocas: string[] = [];
  Object.entries(replacements).forEach(([k, v]) => {
    const re = new RegExp(`\\b${k}\\b`, "gi");
    if (re.test(sugestao)) {
      sugestao = sugestao.replace(re, v);
      trocas.push(`"${k}" → "${v}"`);
    }
  });
  return trocas.length ? { sugestao, trocas } : null;
};

const Triagem = () => {
  const [params] = useSearchParams();
  const tipo = (params.get("tipo") || "interno") as "interno" | "externo";
  const isExterno = tipo === "externo";

  const [stepIdx, setStepIdx] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Array<{ role: "bot" | "user" | "system"; content: string; alert?: { trocas: string[]; sugestao: string; original: string } }>>([
    { role: "bot", content: steps[0].pergunta },
  ]);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, analyzing]);

  const progress = done ? 100 : (stepIdx / steps.length) * 100;

  const handleSend = () => {
    if (!input.trim()) return;
    const current = steps[stepIdx];
    const userText = input.trim();
    setInput("");

    const newMessages: typeof messages = [...messages, { role: "user" as const, content: userText }];

    // Verifica linguagem
    const check = stepIdx === 1 ? checkLanguage(userText) : null;
    if (check) {
      newMessages.push({
        role: "system",
        content: "",
        alert: { trocas: check.trocas, sugestao: check.sugestao, original: userText },
      });
    }

    setAnswers(prev => ({ ...prev, [current.id]: check ? check.sugestao : userText }));

    // Próximo passo ou finaliza
    if (stepIdx + 1 < steps.length) {
      newMessages.push({ role: "bot", content: steps[stepIdx + 1].pergunta });
      setMessages(newMessages);
      setStepIdx(stepIdx + 1);
    } else {
      setMessages(newMessages);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setDone(true);
      }, 1800);
    }
  };

  const resumoIA = useMemo(() => {
    if (!done) return null;
    return {
      resumo: `${answers.descricao || "Demanda registrada"} — identificada no contexto de ${answers.contexto || "ambiente corporativo"}. Frequência: ${answers.frequencia || "a verificar"}. Impacto reportado em: ${answers.impacto || "público interno"}.`,
      classificacao: {
        tipo: "Visual / Atitudinal",
        categoria: "Ambiente Físico",
        atuacao: "Solução estrutural",
        contexto: answers.contexto || "—",
      },
      reaproveitamento: {
        id: "ACS-2024-0987",
        titulo: "Sinalização tátil — piloto 8º andar",
        similaridade: 87,
      },
      acao: "Aplicar padrão de sinalização tátil já validado em outra unidade. Revisar contraste dos elementos visuais.",
      area: "Engenharia & Facilities",
    };
  }, [done, answers]);

  return (
    <div className={`min-h-screen ${isExterno ? "bg-gradient-to-b from-[hsl(60_50%_97%)] to-background" : "bg-background"}`}>
      <BrandHeader variant={tipo} right={
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-base">
          ← Voltar
        </Link>
      } />

      <main className="container max-w-3xl py-6 md:py-10 animate-fade-in">
        {/* Header + progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className={`font-bold text-foreground ${isExterno ? "text-3xl" : "text-2xl"}`}>
              Assistente de Triagem
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1">
              <Sparkles className="h-3 w-3" /> IA ativa
            </Badge>
          </div>
          <p className={`text-muted-foreground mb-4 ${isExterno ? "text-base" : "text-sm"}`}>
            Vou te guiar com algumas perguntas. Foque em descrever o ambiente — não a pessoa.
          </p>
          <div className="flex items-center gap-3">
            <Progress value={progress} className="h-2" />
            <span className="text-xs font-medium text-muted-foreground tabular-nums w-16 text-right">
              {done ? "Concluído" : `Etapa ${stepIdx + 1}/${steps.length}`}
            </span>
          </div>
        </div>

        {/* Chat */}
        <Card className="overflow-hidden shadow-card">
          <div ref={scrollRef} className="h-[460px] overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-muted/20 to-transparent">
            {messages.map((m, i) => {
              if (m.alert) {
                return (
                  <div key={i} className="flex justify-center animate-fade-in">
                    <div className="max-w-[90%] rounded-xl border-2 border-warning/40 bg-warning/10 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-warning-foreground">
                        <Wand2 className="h-4 w-4" />
                        Reformulação sugerida pela IA
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Detectei termos que podem ser substituídos por linguagem mais inclusiva:
                      </div>
                      <div className="space-y-1">
                        {m.alert.trocas.map((t, j) => (
                          <div key={j} className="text-xs font-mono bg-card/60 rounded px-2 py-1 text-foreground">{t}</div>
                        ))}
                      </div>
                      <div className="text-sm text-foreground bg-card rounded-lg p-3 border border-border">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">Versão reformulada</div>
                        {m.alert.sugestao}
                      </div>
                    </div>
                  </div>
                );
              }
              const isBot = m.role === "bot";
              return (
                <div key={i} className={`flex gap-3 animate-slide-in ${isBot ? "" : "flex-row-reverse"}`}>
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    isBot ? "gradient-primary" : "bg-accent"
                  }`}>
                    {isBot
                      ? <Bot className="h-4 w-4 text-primary-foreground" />
                      : <User className="h-4 w-4 text-accent-foreground" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isBot ? "bg-card border border-border rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"
                  }`}>
                    <p className={`text-sm leading-relaxed ${isBot ? "text-foreground" : ""}`}>{m.content}</p>
                  </div>
                </div>
              );
            })}

            {analyzing && (
              <div className="flex gap-3 animate-fade-in">
                <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Analisando, classificando e buscando soluções similares...</span>
                </div>
              </div>
            )}

            {done && resumoIA && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="font-semibold text-sm text-foreground">Resumo gerado pela IA</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{resumoIA.resumo}</p>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                        <ClassItem label="Tipo" value={resumoIA.classificacao.tipo} />
                        <ClassItem label="Categoria" value={resumoIA.classificacao.categoria} />
                        <ClassItem label="Atuação" value={resumoIA.classificacao.atuacao} />
                        <ClassItem label="Contexto" value={resumoIA.classificacao.contexto} />
                      </div>
                    </div>

                    <div className="rounded-xl border-2 border-success/30 bg-success/5 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-success">
                        <Recycle className="h-4 w-4" />
                        Solução semelhante encontrada ({resumoIA.reaproveitamento.similaridade}%)
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono">{resumoIA.reaproveitamento.id}</span> — {resumoIA.reaproveitamento.titulo}
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Plano de ação sugerido</div>
                      <p className="text-sm text-foreground">{resumoIA.acao}</p>
                      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                        Será encaminhado para: <strong className="text-primary">{resumoIA.area}</strong>
                      </div>
                    </div>

                    <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning-foreground mt-0.5 shrink-0" />
                      <p className="text-xs text-foreground leading-relaxed">
                        <strong>Boa prática:</strong> ao tratar essa demanda, oriente a equipe sobre linguagem inclusiva e envolva a pessoa impactada nas decisões.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild className="gap-2">
                    <Link to="/demanda/1">Ver card completo da demanda <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/dashboard">Ir para o dashboard</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          {!done && !analyzing && (
            <div className="border-t border-border bg-card p-4">
              {steps[stepIdx]?.hint && (
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-accent" /> {steps[stepIdx].hint}
                </p>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder={steps[stepIdx]?.placeholder}
                  className={isExterno ? "h-12 text-base" : ""}
                  autoFocus
                />
                <Button onClick={handleSend} disabled={!input.trim()} className="gap-1.5" size={isExterno ? "lg" : "default"}>
                  <Send className="h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

const ClassItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">{label}</div>
    <div className="text-xs font-medium text-foreground">{value}</div>
  </div>
);

export default Triagem;
