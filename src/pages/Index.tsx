import { Link } from "react-router-dom";
import { Building2, Users, ArrowRight, Accessibility, Sparkles, ShieldCheck } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen gradient-subtle">
      {/* Top bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shadow-card">
              <Accessibility className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground text-lg">InclusivAI</span>
                <Sparkles className="h-3.5 w-3.5 text-accent" />
              </div>
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                Plataforma de Acessibilidade Corporativa
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span>WCAG 2.2 AA · LGPD</span>
          </div>
        </div>
      </div>

      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-14 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-semibold mb-5">
            <Sparkles className="h-3.5 w-3.5" /> IA aplicada à inclusão
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-[1.1]">
            Centralize, classifique e <span className="text-primary">resolva</span> demandas de acessibilidade
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Uma plataforma única que entende, conecta e gera soluções —
            transformando a atuação corporativa de reativa para preventiva.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-semibold text-center text-muted-foreground uppercase tracking-wider mb-6">
            Como você quer acessar?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Acesso Interno */}
            <Link
              to="/triagem?tipo=interno"
              className="group relative overflow-hidden rounded-2xl bg-card border-2 border-border hover:border-primary p-8 shadow-card hover:shadow-elegant transition-base focus:outline-none focus:ring-4 focus:ring-ring/30"
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
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Para quem trabalha na empresa. Registre demandas, acompanhe o
                  dashboard estratégico e acesse a base de soluções já implementadas.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Triagem com IA contextual
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Dashboard com indicadores estratégicos
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    Cards de demanda com plano de ação
                  </li>
                </ul>
                <span className="inline-flex items-center gap-2 font-semibold text-primary group-hover:gap-3 transition-base">
                  Iniciar atendimento <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* Acesso Externo */}
            <Link
              to="/triagem?tipo=externo"
              className="group relative overflow-hidden rounded-2xl bg-card border-2 border-border hover:border-success p-8 shadow-card hover:shadow-elegant transition-base focus:outline-none focus:ring-4 focus:ring-success/30"
              style={{ background: "linear-gradient(180deg, hsl(var(--external-bg)), hsl(var(--card)))" }}
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
                <p className="text-foreground/80 leading-relaxed mb-6">
                  Para fornecedores, candidatos e a comunidade. Interface ampliada,
                  linguagem simples e orientação clara em cada etapa.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-foreground/80">
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                    Linguagem inclusiva e acolhedora
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                    Triagem guiada por IA
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                    Encaminhamento direto à área responsável
                  </li>
                </ul>
                <span className="inline-flex items-center gap-2 font-semibold text-success group-hover:gap-3 transition-base">
                  Solicitar acessibilidade <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-base underline-offset-4 hover:underline"
            >
              Sou gestor — ver dashboard estratégico <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-6 mt-10">
        <div className="container text-center text-xs text-muted-foreground">
          InclusivAI · Protótipo funcional · Plataforma de inteligência organizacional para acessibilidade
        </div>
      </footer>
    </main>
  );
};

export default Index;
