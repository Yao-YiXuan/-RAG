import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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
  const [isDark, setIsDark] = useState(theme === 'dark');

  const handleThemeToggle = (checked: boolean) => {
    setIsDark(checked);
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
            界面设置
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            自定义界面主题和语言偏好
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
                <Label className="text-sm font-medium">深色模式</Label>
                <p className="text-xs text-muted-foreground">
                  {isDark ? '当前为深色主题' : '当前为浅色主题'}
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
                <Label className="text-sm font-medium">界面语言</Label>
                <p className="text-xs text-muted-foreground">选择界面显示语言</p>
              </div>
            </div>
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="选择语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-CN">简体中文</SelectItem>
                <SelectItem value="zh-TW">繁體中文</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
                <SelectItem value="ja-JP">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
