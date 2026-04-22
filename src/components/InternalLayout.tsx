import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface InternalLayoutProps {
  children: ReactNode;
  topbarRight?: ReactNode;
  statusLabel?: string;
}

export const InternalLayout = ({ children, topbarRight, statusLabel = "Sistema em operação" }: InternalLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between gap-3 px-4 border-b border-border bg-card sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-foreground text-sm tracking-tight">
                  Inclui<span className="text-primary">+</span>Petrobras
                </span>
                <Sparkles className="h-3.5 w-3.5 text-accent" />
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground ml-2 pl-3 border-l border-border">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                {statusLabel}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {topbarRight}
              <button
                aria-label="Notificações"
                className="relative h-9 w-9 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center transition-base"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <Link
                to="/"
                className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-card hover:shadow-elegant transition-base"
                aria-label="Perfil"
              >
                GP
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
