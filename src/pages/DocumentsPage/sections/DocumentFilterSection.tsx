import { useState, memo } from 'react';
import { Search, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DocumentFilterSectionProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export default memo(function DocumentFilterSection({
  keyword,
  onKeywordChange,
  statusFilter,
  onStatusFilterChange,
}: DocumentFilterSectionProps) {
  const { t, lang } = useI18n();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* 搜索框 */}
      <div className="relative flex-1 min-w-0">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder={t('doc.search.placeholder')}
          className="bg-card/60 backdrop-blur-sm border-border/40 pl-9 pr-9 focus-visible:ring-primary/50"
        />
        {keyword && (
          <Button
            size="icon"
            variant="ghost"
            className="!absolute right-1.5 top-1/2 z-20 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onKeywordChange('')}
            aria-label={lang === 'en-US' ? 'Clear search' : '清除搜索'}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 状态筛选 */}
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[160px] bg-card/60 backdrop-blur-sm border-border/40 focus:ring-primary/50 shrink-0">
          <SelectValue placeholder={t('doc.filter.all')} />
        </SelectTrigger>
        <SelectContent className="bg-card/95 backdrop-blur-md border-border/40">
          <SelectItem value="all">{t('doc.filter.all')}</SelectItem>
          <SelectItem value="processed">{t('doc.filter.processed')}</SelectItem>
          <SelectItem value="processing">{t('doc.filter.processing')}</SelectItem>
          <SelectItem value="failed">{t('doc.filter.failed')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});
