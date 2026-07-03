import { motion } from 'framer-motion';
import { Sparkles, FileText, Search, Code, Terminal } from 'lucide-react';
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
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-muted-foreground mb-3 tracking-wide uppercase">
        试试这些问题
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
                  {item.category}
                </span>
                <span className="block text-sm text-foreground/85 leading-snug transition-colors duration-200 group-hover:text-foreground">
                  {item.text}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
