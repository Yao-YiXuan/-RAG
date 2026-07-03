import { NavLink, useLocation } from 'react-router-dom';
import { MessageSquare, FileText, Settings, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const NAV_ITEMS: { path: string; labelKey: 'nav.home' | 'nav.documents' | 'nav.settings'; icon: typeof MessageSquare }[] = [
  { path: '/', labelKey: 'nav.home', icon: MessageSquare },
  { path: '/documents', labelKey: 'nav.documents', icon: FileText },
  { path: '/settings', labelKey: 'nav.settings', icon: Settings },
];

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { t } = useI18n();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/30 bg-sidebar/60 backdrop-blur-xl"
    >
      <SidebarHeader className="border-b border-sidebar-border/20">
        <div className="flex items-center gap-2.5 px-3 py-4 group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:justify-center">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/20">
            <Sparkles className="size-5 text-white" />
          </div>
          <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden">
            <div className="text-sm font-semibold tracking-wide text-sidebar-foreground truncate">
              {t('sidebar.title')}
            </div>
            <div className="text-[11px] text-sidebar-foreground/50 truncate">
              {t('sidebar.subtitle')}
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/'
                  ? pathname === '/'
                  : pathname === item.path || pathname.startsWith(`${item.path}/`);

              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={t(item.labelKey)} isActive={isActive}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className="flex items-center gap-2.5"
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="group-data-[state=collapsed]:hidden">
                        {t(item.labelKey)}
                      </span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/20">
        <div className="flex items-center gap-2 px-3 py-3 group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:justify-center">
          <div className="size-7 shrink-0 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/30 ring-1 ring-cyan-400/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-cyan-300">R</span>
          </div>
          <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden">
            <div className="text-xs font-medium text-sidebar-foreground/70 truncate">
              RAG v1.0
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
