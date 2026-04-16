import { InternalLayout } from "@/components/InternalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Inbox, Loader2, GitBranch, XCircle, Search, RefreshCw, Sparkles,
  Monitor, MessageCircle, Accessibility, Heart, MapPin, Building2,
  CheckCircle2, Lightbulb, Settings2
} from "lucide-react";
import { Link } from "react-router-dom";

type Prioridade = "alta" | "media" | "baixa";
type Item = {
  protocolo: string;
  prioridade: Prioridade;
  barreira: string;
  titulo: string;
  deficiencia: string;
  area: string;
  unidade: string;
  tempo: string;
  confianca?: number;
  classificando?: boolean;
  direcionado?: string;
  icon: any;
  iconColor: string;
  iconBg: string;
};

const itens: Item[] = [
  {
    protocolo: "ACC-2025-458",
    prioridade: "alta",
    barreira: "Barreira Tecnológica",
    titulo: "Leitor de tela não funciona no sistema SAP interno",
    deficiencia: "Deficiência Visual",
    area: "TIC",
    unidade: "RPBC",
    tempo: "Há 12 min",
    confianca: 98,
    icon: Monitor,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
  },
  {
    protocolo: "ACC-2025-457",
    prioridade: "media",
    barreira: "Barreira Comunicacional",
    titulo: "Falta de intérprete em reunião obrigatória",
    deficiencia: "Deficiência Auditiva",
    area: "Comunicação",
    unidade: "SEDE",
    tempo: "Há 18 min",
    classificando: true,
    icon: MessageCircle,
    iconColor: "text-accent-foreground",
    iconBg: "bg-accent/20",
  },
  {
    protocolo: "ACC-2025-456",
    prioridade: "media",
    barreira: "Barreira Arquitetônica",
    titulo: "Porta estreita no prédio administrativo (3º andar)",
    deficiencia: "Deficiência Física",
    area: "Serviços Prediais",
    unidade: "RJ",
    tempo: "Há 25 min",
    confianca: 95,
    direcionado: "SP",
    icon: Accessibility,
    iconColor: "text-success",
    iconBg: "bg-success/15",
  },
  {
    protocolo: "ACC-2025-455",
    prioridade: "baixa",
    barreira: "Barreira Atitudinal",
    titulo: "Comentário inadequado sobre autismo em equipe",
    deficiencia: "TEA",
    area: "RH",
    unidade: "UN-ES",
    tempo: "Há 33 min",
    confianca: 87,
    direcionado: "RH",
    icon: Heart,
    iconColor: "text-info",
    iconBg: "bg-info/10",
  },
];

const prioridadeStyles: Record<Prioridade, { bar: string; badge: string; label: string }> = {
  alta: {
    bar: "bg-destructive",
    badge: "bg-destructive/10 text-destructive border-destructive/30",
    label: "ALTA PRIORIDADE",
  },
  media: {
    bar: "bg-accent",
    badge: "bg-accent/15 text-accent-foreground border-accent/40",
    label: "MÉDIA PRIORIDADE",
  },
  baixa: {
    bar: "bg-success",
    badge: "bg-success/10 text-success border-success/30",
    label: "BAIXA PRIORIDADE",
  },
};

const TriagemFila = () => {
  return (
    <InternalLayout
      topbarRight={
        <>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </Button>
          <Button size="sm" className="gap-1.5 h-9">
            <Sparkles className="h-3.5 w-3.5" /> Triagem com IA
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Triagem de Demandas</h1>
          </div>
          <p className="text-muted-foreground text-sm">IA classificando e direcionando automaticamente</p>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatusCard icon={Inbox} value={12} label="Novas recebidas" hint="2 altas" hintTone="destructive" iconBg="bg-info/10" iconColor="text-info" />
          <StatusCard icon={Loader2} value={3} label="Classificando..." hint="IA ativa" hintTone="accent" iconBg="bg-accent/15" iconColor="text-accent-foreground" spin />
          <StatusCard icon={GitBranch} value={8} label="Direcionadas" iconBg="bg-success/10" iconColor="text-success" />
          <StatusCard icon={XCircle} value={1} label="Com dúvidas" hint="Revisar" hintTone="destructive" iconBg="bg-destructive/10" iconColor="text-destructive" />
        </div>

        {/* Filters */}
        <Card className="p-3 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por descrição, unidade ou protocolo..." className="pl-9 h-9 border-0 bg-muted/50" />
            </div>
            <SelectChip label="Tipo: Todos" />
            <SelectChip label="Urgência: Todas" />
            <SelectChip label="Status: Todos" />
            <SelectChip label="Mais recentes" sort />
          </div>
        </Card>

        {/* Lista */}
        <div className="space-y-3">
          {itens.map((item) => {
            const p = prioridadeStyles[item.prioridade];
            return (
              <Card key={item.protocolo} className="overflow-hidden shadow-card hover:shadow-elegant transition-base">
                <div className="flex">
                  <div className={`w-1.5 ${p.bar} shrink-0`} />
                  <div className="flex-1 p-4 flex flex-wrap items-start gap-4">
                    <div className={`h-12 w-12 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-[260px]">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <Badge variant="outline" className={`${p.badge} text-[10px] font-bold uppercase tracking-wide`}>
                          {p.label}
                        </Badge>
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-0 text-[10px] font-medium">
                          {item.barreira}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground leading-snug">{item.titulo}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Accessibility className="h-3 w-3" /> {item.deficiencia}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {item.area}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Unidade: {item.unidade}</span>
                        <span>·</span>
                        <span className="font-mono">#{item.protocolo}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {item.classificando ? (
                        <span className="text-xs font-semibold text-info inline-flex items-center gap-1.5 bg-info/10 px-2.5 py-1 rounded-full">
                          <Loader2 className="h-3 w-3 animate-spin" /> Classificando...
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-success inline-flex items-center gap-1.5 bg-success/10 px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> IA: {item.confianca}% confiança
                        </span>
                      )}
                      <div className="text-[11px] text-muted-foreground">
                        {item.tempo}
                        {item.direcionado && (
                          <span className="ml-2">· Direcionado <span className="text-primary font-bold">→ {item.direcionado}</span></span>
                        )}
                      </div>
                    </div>

                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <Link to={`/demanda/${itens.indexOf(item) + 1}`}>Abrir</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* IA em ação */}
        <Card className="p-5 bg-success/5 border-success/30 border-2 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-success" />
              <h3 className="font-bold text-foreground">IA em ação na triagem</h3>
              <Badge className="bg-primary/10 text-primary border-0 font-medium">Modelo v2.1 ativo</Badge>
            </div>
            <button className="text-sm text-primary font-semibold hover:underline">Ver detalhes →</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <span className="text-foreground/90">Classificação automática por tipo de barreira</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <span className="text-foreground/90">Identificação do perfil da deficiência</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <span className="text-foreground/90">Sugestão de área responsável + prioridade</span>
            </div>
          </div>
        </Card>

        {/* Footer hint */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-accent" />
            Dúvidas na classificação? Clique em "Revisar" para análise humana
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">Ctrl + R</kbd>
          </div>
          <button className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-base">
            <Settings2 className="h-3.5 w-3.5" /> Configurar regras de triagem
          </button>
        </div>
      </div>
    </InternalLayout>
  );
};

const StatusCard = ({
  icon: Icon, value, label, hint, hintTone, iconBg, iconColor, spin,
}: {
  icon: any; value: number; label: string; hint?: string;
  hintTone?: "destructive" | "accent"; iconBg: string; iconColor: string; spin?: boolean;
}) => (
  <Card className="p-4 shadow-card">
    <div className="flex items-center gap-3">
      <div className={`h-11 w-11 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`h-5 w-5 ${iconColor} ${spin ? "animate-spin" : ""}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {hint && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
              hintTone === "destructive" ? "bg-destructive/10 text-destructive" : "bg-accent/15 text-accent-foreground"
            }`}>
              {hint}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground truncate">{label}</div>
      </div>
    </div>
  </Card>
);

const SelectChip = ({ label, sort }: { label: string; sort?: boolean }) => (
  <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md bg-muted/50 hover:bg-muted text-xs font-medium text-foreground transition-base">
    {sort && <span className="text-muted-foreground">⇅</span>}
    {label}
    {!sort && <span className="text-muted-foreground">▾</span>}
  </button>
);

export default TriagemFila;
