import { Link } from "react-router-dom";
import { BRLogo } from "@/components/BRLogo";
import { Building2, Users, ArrowRight, Sparkles, ShieldCheck, Accessibility, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-success/5 via-background to-accent/5">
      {/* Decorative curves */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden>
        <path d="M0,150 Q300,80 600,200 T1200,150" stroke="hsl(158 60% 40%)" strokeWidth="1.5" fill="none" />
        <path d="M0,500 Q400,400 700,580 T1200,500" stroke="hsl(48 96% 53%)" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Top bar */}
      <div className="relative border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <BRLogo size={36} variant="dark" />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" />
              WCAG 2.2 AA · LGPD
            </span>
            <Link to="/dashboard" className="inline-flex items-center gap-1 font-medium hover:text-primary transition-base">
              <BarChart3 className="h-3.5 w-3.5" /> Dashboard
            </Link>
          </div>
        </div>
      </div>

      <section className="relative container py-14 md:py-20">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-5">
            <Sparkles className="h-3.5 w-3.5" /> Acesso+ Inteligente
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-[1.1]">
            Plataforma <span className="text-primary">Centralizada</span> de Acessibilidade com IA
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Centraliza demandas, automatiza triagem e gera inteligência organizacional —
            transformando a atuação de reativa para preventiva.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <h2 className="text-xs font-bold text-center text-muted-foreground uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-border" />
            Como você quer acessar?
            <span className="h-px w-8 bg-border" />
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Acesso Interno */}
            <Link
              to="/triagem?tipo=interno"
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/60 p-7 shadow-card hover:shadow-elegant transition-base focus:outline-none focus:ring-4 focus:ring-ring/30"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-base" />
              <div className="relative">
                <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mb-5 shadow-card">
                  <Building2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-foreground">Acesso Interno</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                    Colaboradores
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  Para quem trabalha na empresa. Registre demandas, acompanhe o
                  dashboard estratégico e acesse a base de soluções já implementadas.
                </p>
                <ul className="space-y-2 mb-5 text-sm text-foreground/80">
                  <Bullet>Triagem inteligente com IA contextual</Bullet>
                  <Bullet>Dashboard com indicadores estratégicos</Bullet>
                  <Bullet>Cards de demanda com plano de ação</Bullet>
                </ul>
                <span className="inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-base">
                  Iniciar atendimento <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* Acesso Externo */}
            <Link
              to="/hub-externo"
              className="group relative overflow-hidden rounded-2xl border border-border hover:border-success/60 p-7 shadow-card hover:shadow-elegant transition-base focus:outline-none focus:ring-4 focus:ring-success/30"
              style={{ background: "linear-gradient(180deg, hsl(60 50% 97%), hsl(var(--card)))" }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/15 rounded-full blur-3xl group-hover:bg-accent/25 transition-base" />
              <div className="relative">
                <div className="h-14 w-14 rounded-xl gradient-external flex items-center justify-center mb-5 shadow-card">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-foreground">Acesso Externo</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/30 text-accent-foreground uppercase">
                    Comunidade
                  </span>
                </div>
                <p className="text-foreground/80 leading-relaxed mb-5">
                  Para fornecedores, candidatos e a comunidade. Interface ampliada,
                  linguagem simples e orientação clara em cada etapa.
                </p>
                <ul className="space-y-2 mb-5 text-sm text-foreground/80">
                  <Bullet color="success">Linguagem inclusiva e acolhedora</Bullet>
                  <Bullet color="success">Triagem guiada por IA</Bullet>
                  <Bullet color="success">Encaminhamento direto à área responsável</Bullet>
                </ul>
                <span className="inline-flex items-center gap-2 font-bold text-success group-hover:gap-3 transition-base">
                  Solicitar acessibilidade <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-base"
            >
              <BarChart3 className="h-4 w-4" /> Sou gestor — ver dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="hidden md:inline text-muted-foreground/50">·</span>
            <Link
              to="/triagem-fila"
              className="inline-flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-base"
            >
              <Accessibility className="h-4 w-4" /> Ver fila de triagem
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border/50 py-6 mt-10 bg-card/50 backdrop-blur-sm">
        <div className="container text-center text-xs text-muted-foreground">
          Plataforma Centralizada de Acessibilidade com IA · Protótipo funcional · Petrobras
        </div>
      </footer>
    </main>
  );
};

const Bullet = ({ children, color = "primary" }: { children: React.ReactNode; color?: "primary" | "success" }) => (
  <li className="flex items-start gap-2">
    <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${color === "success" ? "bg-success" : "bg-primary"}`} />
    {children}
  </li>
);

export default Index;
