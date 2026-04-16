import { Demand } from "@/types/platform";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Recycle, AlertTriangle, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles: Record<Demand["status"], string> = {
  "novo": "bg-info/10 text-info border-info/20",
  "em-analise": "bg-warning/15 text-warning-foreground border-warning/30",
  "encaminhado": "bg-primary/10 text-primary border-primary/20",
  "resolvido": "bg-success/15 text-success border-success/30",
};

const statusLabel: Record<Demand["status"], string> = {
  "novo": "Novo",
  "em-analise": "Em análise",
  "encaminhado": "Encaminhado",
  "resolvido": "Resolvido",
};

export const DemandCard = ({ demand, compact = false }: { demand: Demand; compact?: boolean }) => {
  return (
    <Link to={`/demanda/${demand.id}`} className="block group">
      <Card className="p-5 shadow-card hover:shadow-elegant transition-base border-l-4 border-l-primary group-hover:border-l-accent">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-muted-foreground">{demand.protocolo}</span>
            <Badge variant="outline" className={statusStyles[demand.status]}>
              {statusLabel[demand.status]}
            </Badge>
            {demand.agrupamento && (
              <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/30 gap-1">
                <Layers className="h-3 w-3" /> {demand.agrupamento}
              </Badge>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-base" />
        </div>

        <p className={`text-foreground leading-relaxed mb-3 ${compact ? "line-clamp-2 text-sm" : "text-[15px]"}`}>
          {demand.resumo}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="secondary" className="text-xs">{demand.classificacao.categoria}</Badge>
          <Badge variant="secondary" className="text-xs">{demand.classificacao.tipoNecessidade}</Badge>
          <Badge variant="secondary" className="text-xs">{demand.classificacao.tipoAtuacao}</Badge>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
          <span className="font-medium">→ {demand.area}</span>
          <div className="flex items-center gap-3">
            {demand.reaproveitamento && (
              <span className="flex items-center gap-1 text-success font-medium">
                <Recycle className="h-3.5 w-3.5" /> Reaproveita {demand.reaproveitamento.similaridade}%
              </span>
            )}
            {demand.alertaBoasPraticas && (
              <span className="flex items-center gap-1 text-warning-foreground">
                <AlertTriangle className="h-3.5 w-3.5" /> Alerta
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};
