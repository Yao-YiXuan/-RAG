import { motion } from 'framer-motion';
import { Sparkles, FileText, Search, Code, Terminal } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { MOCK_SUGGESTION_QUESTIONS } from '@/data/suggestion-question';

interface SuggestionSectionProps {
  onSend: (text: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  '文档摘要': FileText,
  '技术分析': Code,
  '数据洞察': Search,
  '接口查询': Terminal,
  '运维指南': Sparkles,
};

export default function SuggestionSection({ onSend }: SuggestionSectionProps) {
  const { t } = useI18n();

  const categoryLabels: Record<string, string> = {
    '文档摘要': t('suggestion.category.doc_summary'),
    '技术分析': t('suggestion.category.tech_analysis'),
    '数据洞察': t('suggestion.category.data_insight'),
    '接口查询': t('suggestion.category.api_query'),
    '运维指南': t('suggestion.category.ops_guide'),
  };

  const questionTexts: Record<string, string> = {
    '1': t('question.example1'),
    '2': t('question.example2'),
    '3': t('question.example3'),
    '4': t('question.example4'),
    '5': t('question.example5'),
  };

  return (
    <div className="w-full">
      <p className="text-xs font-medium text-muted-foreground mb-3 tracking-wide uppercase">
        {t('suggestion.title')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {MOCK_SUGGESTION_QUESTIONS.map((item, i) => {
          const Icon = CATEGORY_ICONS[item.category] || Sparkles;
          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSend(item.text)}
              className="group flex items-start gap-3 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm px-4 py-3.5 text-left transition-all duration-200 hover:border-primary/30 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/20">
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-muted-foreground mb-0.5">
                  {categoryLabels[item.category] || item.category}
                </span>
                <span className="block text-sm text-foreground/85 leading-snug transition-colors duration-200 group-hover:text-foreground">
                  {questionTexts[item.id] || item.text}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
