import { motion } from 'framer-motion';
import { Sun, Moon, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useI18n } from '@/lib/i18n';

interface SettingsAppearanceSectionProps {
  theme: 'dark' | 'light';
  language: string;
  onThemeChange: (theme: 'dark' | 'light') => void;
  onLanguageChange: (language: string) => void;
}

export default function SettingsAppearanceSection({
  theme,
  language,
  onThemeChange,
  onLanguageChange,
}: SettingsAppearanceSectionProps) {
  const isDark = theme === 'dark';
  const { t } = useI18n();

  const handleThemeToggle = (checked: boolean) => {
    onThemeChange(checked ? 'dark' : 'light');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Globe className="size-5 text-primary" />
            {t('settings.appearance.title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('settings.appearance.desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 主题切换 */}
          <div className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                {isDark ? (
                  <Moon className="size-4 text-primary" />
                ) : (
                  <Sun className="size-4 text-primary" />
                )}
              </div>
              <div>
                <Label className="text-sm font-medium">{t('settings.appearance.darkMode')}</Label>
                <p className="text-xs text-muted-foreground">
                  {isDark ? t('settings.appearance.darkDesc') : t('settings.appearance.lightDesc')}
                </p>
              </div>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={handleThemeToggle}
              aria-label="切换深色模式"
            />
          </div>

          {/* 语言选择 */}
          <div className="flex items-center justify-between rounded-lg border border-border/30 bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="size-4 text-primary" />
              </div>
              <div>
                <Label className="text-sm font-medium">{t('settings.appearance.language')}</Label>
                <p className="text-xs text-muted-foreground">{t('settings.appearance.languageDesc')}</p>
              </div>
            </div>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-CN">{t('settings.appearance.lang.zh-CN')}</SelectItem>
                <SelectItem value="en-US">{t('settings.appearance.lang.en-US')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
