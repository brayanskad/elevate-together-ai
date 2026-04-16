import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: "up-good" | "down-good" | "neutral";
  hint?: string;
}

export const MetricCard = ({ icon: Icon, label, value, trend = "neutral", hint }: MetricCardProps) => {
  const TrendIcon = trend === "up-good" ? TrendingUp : trend === "down-good" ? TrendingDown : Minus;
  const trendColor =
    trend === "neutral" ? "text-muted-foreground" : "text-success";

  return (
    <Card className="p-5 shadow-card hover:shadow-elegant transition-base group">
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-base">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>
        <div className="text-sm text-muted-foreground leading-snug">{label}</div>
        {hint && <div className="text-xs text-muted-foreground/80 mt-2">{hint}</div>}
      </div>
    </Card>
  );
};
