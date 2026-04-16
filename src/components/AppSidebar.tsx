import {
  LayoutDashboard,
  Inbox,
  Lightbulb,
  TrendingUp,
  MapPin,
  ClipboardCheck,
  FileText,
  Sparkles,
  Database,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { BRLogo } from "@/components/BRLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Visão Geral", url: "/dashboard", icon: LayoutDashboard },
  { title: "Triagem de Demandas", url: "/triagem-fila", icon: Inbox, badge: "12" },
  { title: "Insights IA", url: "/dashboard#insights", icon: Lightbulb },
  { title: "Tendências", url: "/dashboard#tendencias", icon: TrendingUp },
  { title: "Mapa", url: "/dashboard#mapa", icon: MapPin },
  { title: "Ações", url: "/dashboard#acoes", icon: ClipboardCheck },
];

const secondaryItems = [
  { title: "Base de Soluções", url: "/dashboard#base", icon: Database },
  { title: "Relatórios", url: "/dashboard#relatorios", icon: FileText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (url: string) => {
    const path = url.split("#")[0];
    return location.pathname === path;
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="bg-sidebar p-4 border-b border-sidebar-border/40">
        {!collapsed ? (
          <BRLogo size={36} showWordmark variant="light" />
        ) : (
          <BRLogo size={28} showWordmark={false} />
        )}
      </SidebarHeader>

      <SidebarContent className="bg-sidebar pt-3">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 mb-1">
              <Sparkles className="h-3 w-3 text-sidebar-primary" />
              Acesso+ Inteligente
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold data-[active=true]:border-l-4 data-[active=true]:border-sidebar-primary text-sidebar-foreground/90 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground rounded-md mx-1"
                  >
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <span className="bg-sidebar-primary text-sidebar-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-[10px] font-bold uppercase tracking-wider px-3 mb-1">
              Recursos
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground rounded-md mx-1"
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-sidebar p-3 border-t border-sidebar-border/40">
        {!collapsed ? (
          <div className="rounded-lg border border-sidebar-primary/40 bg-sidebar-primary/10 px-3 py-2.5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sidebar-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-sidebar-primary">IA Ativa</div>
              <div className="text-[10px] text-sidebar-foreground/70 truncate">Modelo v2.1 · monitorando</div>
            </div>
            <span className="h-2 w-2 rounded-full bg-sidebar-primary animate-pulse" />
          </div>
        ) : (
          <div className="flex justify-center">
            <Sparkles className="h-4 w-4 text-sidebar-primary" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
