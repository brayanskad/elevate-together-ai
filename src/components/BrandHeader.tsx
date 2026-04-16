import { Accessibility, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface BrandHeaderProps {
  variant?: "interno" | "externo" | "neutral";
  right?: React.ReactNode;
}

export const BrandHeader = ({ variant = "neutral", right }: BrandHeaderProps) => {
  const isExterno = variant === "externo";
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center shadow-card transition-base group-hover:scale-105 ${isExterno ? "gradient-external" : "gradient-primary"}`}>
            <Accessibility className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground text-lg">InclusivAI</span>
              <Sparkles className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
              {variant === "interno" ? "Portal Interno" : variant === "externo" ? "Portal Externo" : "Acessibilidade Corporativa"}
            </span>
          </div>
        </Link>
        {right}
      </div>
    </header>
  );
};
