import { SidebarTrigger } from '@/components/ui/sidebar';
import { MessageSquare } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/20 bg-background/60 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 shadow-sm shadow-cyan-500/20">
            <MessageSquare className="size-4 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-wide text-foreground">
              {t('sidebar.title')}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {t('sidebar.subtitle')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
