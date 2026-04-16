import { BrandHeader } from "@/components/BrandHeader";
import { MetricCard } from "@/components/MetricCard";
import { DemandCard } from "@/components/DemandCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDemands, dashboardMetrics } from "@/data/mockDemands";
import {
  Clock, Recycle, Repeat2, Layers3, Timer, ListChecks,
  Plus, AlertOctagon, Network, ChevronRight, Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

const Dashboard = () => {
  const [filter, setFilter] = useState<"todas" | "agrupadas" | "estruturais">("todas");

  const filtered = useMemo(() => {
    if (filter === "agrupadas") return mockDemands.filter(d => d.agrupamento);
    if (filter === "estruturais") return mockDemands.filter(d => d.classificacao.tipoAtuacao === "Solução estrutural");
    return mockDemands;
  }, [filter]);

  const grupos = useMemo(() => {
    const map = new Map<string, number>();
    mockDemands.forEach(d => d.agrupamento && map.set(d.agrupamento, (map.get(d.agrupamento) || 0) + 1));
    return [...map.entries()].filter(([, n]) => n > 1);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader
        variant="interno"
        right={
          <Button asChild size="sm" className="gap-2">
            <Link to="/triagem?tipo=interno"><Plus className="h-4 w-4" /> Nova demanda</Link>
          </Button>
        }
      />

      <main className="container py-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Visão Estratégica</p>
            <h1 className="text-3xl font-bold text-foreground">Dashboard de Acessibilidade</h1>
            <p className="text-muted-foreground mt-1">Inteligência organizacional em tempo real · 1º trimestre 2025</p>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/30 gap-1.5 py-1.5 px-3">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
            IA monitorando padrões
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard icon={Clock} value={dashboardMetrics.tempoResposta.valor} label={dashboardMetrics.tempoResposta.label} trend="down-good" />
          <MetricCard icon={Recycle} value={dashboardMetrics.reaproveitamento.valor} label={dashboardMetrics.reaproveitamento.label} trend="up-good" />
          <MetricCard icon={Repeat2} value={dashboardMetrics.recorrentes.valor} label={dashboardMetrics.recorrentes.label} trend="down-good" />
          <MetricCard icon={Layers3} value={dashboardMetrics.estruturais.valor} label={dashboardMetrics.estruturais.label} trend="up-good" />
          <MetricCard icon={Timer} value={dashboardMetrics.adaptacao.valor} label={dashboardMetrics.adaptacao.label} />
          <MetricCard icon={ListChecks} value={dashboardMetrics.total.valor} label={dashboardMetrics.total.label} />
        </div>

        {/* Insight de correlação */}
        <Card className="p-6 border-l-4 border-l-warning bg-gradient-to-br from-warning/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
              <AlertOctagon className="h-5 w-5 text-warning-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-warning-foreground bg-warning/20 px-2 py-0.5 rounded">
                  Padrão detectado
                </span>
                <span className="text-xs text-muted-foreground">há 2h pela IA</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Problema estrutural identificado: "Sinalização Sede"
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                A IA correlacionou <strong className="text-foreground">2 demandas</strong> sobre sinalização tátil e contraste em
                andares diferentes da mesma unidade. Recomenda-se uma <strong className="text-foreground">solução estrutural única</strong> ao invés de adaptações pontuais.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="default" className="gap-1.5">
                  <Network className="h-3.5 w-3.5" /> Ver demandas correlacionadas
                </Button>
                <Button size="sm" variant="outline">Aprovar plano estrutural</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Grupos */}
        {grupos.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Demandas agrupadas pela IA
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {grupos.map(([nome, qtd]) => (
                <Card key={nome} className="p-4 flex items-center justify-between hover:shadow-elegant transition-base cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-accent/15 flex items-center justify-center">
                      <Layers3 className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{nome}</div>
                      <div className="text-xs text-muted-foreground">{qtd} demandas relacionadas</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-base" />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Lista de demandas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Demandas recentes</h2>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground ml-2 mr-1" />
              {(["todas", "agrupadas", "estruturais"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-md capitalize transition-base ${
                    filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {filtered.map(d => <DemandCard key={d.id} demand={d} />)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
