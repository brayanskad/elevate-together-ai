import { InternalLayout } from "@/components/InternalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDemands } from "@/data/mockDemands";
import {
  Accessibility, CheckCircle2, Clock, Star, Sparkles, Lightbulb,
  TrendingUp, Filter, Download, ArrowUpRight, ArrowDownRight,
  Building2, Monitor, MessageSquare, Heart, Bus, ChevronRight, AlertOctagon
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { Link } from "react-router-dom";

const barreiras = [
  { name: "Arquitetônica", value: 38, delta: "+15%", up: true, color: "hsl(205 75% 42%)", icon: Building2 },
  { name: "Tecnológica",   value: 27, delta: "+8%",  up: true, color: "hsl(145 55% 38%)", icon: Monitor },
  { name: "Comunicacional",value: 18, delta: "-5%",  up: false,color: "hsl(48 96% 53%)",  icon: MessageSquare },
  { name: "Atitudinal",    value: 12, delta: "-10%", up: false,color: "hsl(0 70% 55%)",   icon: Heart },
  { name: "Transporte",    value: 5,  delta: "+20%", up: true, color: "hsl(280 50% 55%)", icon: Bus },
];

const evolucao = [
  { mes: "Jan", "2024": 78, "2023": 42 },
  { mes: "Fev", "2024": 95, "2023": 50 },
  { mes: "Mar", "2024": 88, "2023": 55 },
  { mes: "Abr", "2024": 110,"2023": 70 },
  { mes: "Mai", "2024": 125,"2023": 85 },
  { mes: "Jun", "2024": 118,"2023": 92 },
  { mes: "Jul", "2024": 135,"2023": 100 },
  { mes: "Ago", "2024": 150,"2023": 108 },
  { mes: "Set", "2024": 145,"2023": 115 },
  { mes: "Out", "2024": 162,"2023": 122 },
  { mes: "Nov", "2024": 175,"2023": 128 },
  { mes: "Dez", "2024": 182,"2023": 135 },
];

const topAreas = [
  { nome: "TIC",            valor: 42, delta: "+18%", up: true,  color: "hsl(145 55% 38%)" },
  { nome: "Serviços Prediais", valor: 28, delta: "-5%", up: false, color: "hsl(158 60% 22%)" },
  { nome: "RH",             valor: 19, delta: "+12%", up: true,  color: "hsl(48 96% 53%)" },
  { nome: "Comunicação",    valor: 15, delta: "+30%", up: true,  color: "hsl(205 75% 42%)" },
  { nome: "Saúde",          valor: 12, delta: "-8%",  up: false, color: "hsl(280 50% 55%)" },
];

const heroMetrics = [
  { icon: Accessibility, label: "Demandas Abertas", value: "128", delta: "+12%", up: true, color: "primary" },
  { icon: CheckCircle2,  label: "Resolvidas (30d)", value: "342", delta: "+18%", up: true, color: "success" },
  { icon: Clock,         label: "Tempo Médio",      value: "4,2 dias", delta: "-22%", up: false, color: "warning" },
  { icon: Star,          label: "Satisfação",       value: "4,7 / 5,0", delta: "+0,3", up: true, color: "info" },
];

const Dashboard = () => {
  return (
    <InternalLayout
      topbarRight={
        <>
          <span className="hidden md:inline-flex text-xs text-muted-foreground items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Dados atualizados há 5 min
          </span>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <Filter className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Filtros</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Exportar</span>
          </Button>
        </>
      }
    >
      <div className="p-6 space-y-6 animate-fade-in max-w-[1600px] mx-auto">
        {/* Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Dashboard de Acessibilidade</h1>
            <Badge className="bg-accent text-accent-foreground border-0 font-bold gap-1">
              <Sparkles className="h-3 w-3" /> IA
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">1º trimestre 2025 · Visão estratégica</p>
        </div>

        {/* Hero metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {heroMetrics.map((m) => (
            <Card key={m.label} className="p-5 shadow-card hover:shadow-elegant transition-base">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                  m.color === "primary" ? "bg-primary/10" :
                  m.color === "success" ? "bg-success/10" :
                  m.color === "warning" ? "bg-accent/15" : "bg-info/10"
                }`}>
                  <m.icon className={`h-5 w-5 ${
                    m.color === "primary" ? "text-primary" :
                    m.color === "success" ? "text-success" :
                    m.color === "warning" ? "text-accent-foreground" : "text-info"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
                  <div className="text-2xl font-bold text-foreground tracking-tight">{m.value}</div>
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold mt-1 px-1.5 py-0.5 rounded ${
                    m.up ? "text-success bg-success/10" : "text-success bg-success/10"
                  }`}>
                    {m.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {m.delta}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mid grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Donut */}
          <Card className="p-5 lg:col-span-2 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Demandas por Tipo de Barreira</h2>
              <Badge variant="outline" className="bg-info/10 text-info border-info/30 gap-1 font-medium">
                <Sparkles className="h-3 w-3" /> IA: Padrões detectados
              </Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 items-center">
              <div className="relative h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={barreiras}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {barreiras.map((b, i) => <Cell key={i} fill={b.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-3xl font-bold text-foreground">128</div>
                  <div className="text-xs text-muted-foreground">total</div>
                </div>
              </div>
              <div className="space-y-2">
                {barreiras.map((b) => (
                  <div key={b.name} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: b.color }} />
                    <b.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-foreground">{b.name}</span>
                    <span className="font-bold text-foreground">{b.value}%</span>
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded tabular-nums w-12 text-center ${
                      b.up ? "text-destructive bg-destructive/10" : "text-success bg-success/10"
                    }`}>
                      {b.up ? "↑" : "↓"} {b.delta.replace("+","").replace("-","")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Insight IA */}
          <Card id="insights" className="p-5 bg-accent/8 border-accent/30 border-2 shadow-card">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Lightbulb className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground">Insight da IA</h3>
                <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed">
                  <strong>70% das demandas</strong> de PCD auditiva relacionadas à <strong>Comunicação Interna</strong>
                </p>
                <button className="text-sm text-primary font-semibold mt-3 hover:underline inline-flex items-center gap-1">
                  → Recomendar treinamento prioritário
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Evolução */}
          <Card id="tendencias" className="p-5 lg:col-span-2 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Evolução Mensal de Demandas</h2>
              <Badge className="bg-success/15 text-success border-0 gap-1 font-medium">
                <TrendingUp className="h-3 w-3" /> +18% vs. mês anterior
              </Badge>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucao} margin={{ top: 5, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="2024" stroke="hsl(158 60% 22%)" strokeWidth={3} dot={{ fill: "hsl(158 60% 22%)", r: 3 }} />
                  <Line type="monotone" dataKey="2023" stroke="hsl(48 96% 53%)" strokeWidth={3} dot={{ fill: "hsl(48 96% 53%)", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Áreas */}
          <Card className="p-5 shadow-card">
            <h2 className="font-bold text-foreground mb-4">Top 5 Áreas com Mais Demandas</h2>
            <div className="space-y-3">
              {topAreas.map((a, i) => (
                <div key={a.nome} className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded bg-muted flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground truncate">{a.nome}</span>
                      <span className="text-sm font-bold text-foreground tabular-nums">{a.valor}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(a.valor / 42) * 100}%`, background: a.color }}
                      />
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                    a.up ? "text-destructive bg-destructive/10" : "text-success bg-success/10"
                  }`}>
                    {a.up ? "↑" : "↓"} {a.delta.replace("+","").replace("-","")}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Previsão IA + Estrutural */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-5 bg-success/5 border-success/30 border-2 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-success" />
              <h3 className="font-bold text-success">Previsão IA</h3>
              <span className="text-xs text-muted-foreground">(Próximos 60 dias)</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                <ArrowUpRight className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-foreground">+23% <span className="text-base font-medium text-muted-foreground">em demandas de Acessibilidade Digital</span></div>
                <p className="text-xs text-muted-foreground mt-1">Baseado em aumento recente de solicitações</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-l-4 border-l-warning shadow-card">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
                <AlertOctagon className="h-5 w-5 text-warning-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-warning-foreground bg-warning/20 px-2 py-0.5 rounded">
                    Padrão estrutural
                  </span>
                  <span className="text-xs text-muted-foreground">há 2h</span>
                </div>
                <h3 className="font-semibold text-foreground">"Sinalização Sede" — 2 demandas correlacionadas</h3>
                <p className="text-xs text-muted-foreground mt-1.5 mb-3">
                  IA recomenda solução estrutural única ao invés de adaptações pontuais.
                </p>
                <Button size="sm" className="gap-1.5">
                  Ver demandas correlacionadas <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Demandas recentes */}
        <Card id="acoes" className="p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground">Demandas Recentes</h2>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-primary">
              <Link to="/triagem-fila">Ver todas <ChevronRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {mockDemands.slice(0, 4).map((d) => (
              <Link
                key={d.id}
                to={`/demanda/${d.id}`}
                className="flex items-center gap-3 py-3 hover:bg-muted/40 -mx-2 px-2 rounded-md transition-base group"
              >
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded shrink-0">{d.protocolo}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{d.resumo.split(".")[0]}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <span>{d.classificacao.categoria}</span>
                    <span>·</span>
                    <span>{d.area}</span>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize shrink-0">{d.status.replace("-", " ")}</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-base shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </InternalLayout>
  );
};

export default Dashboard;
