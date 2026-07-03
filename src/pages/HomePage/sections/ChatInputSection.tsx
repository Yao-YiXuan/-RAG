import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ChatInputSectionProps {
  onSend: (message: string) => void;
}

export default function ChatInputSection({ onSend }: ChatInputSectionProps) {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    onSend(trimmed);
    setInput('');

    // 模拟发送延迟后恢复
    await new Promise((r) => setTimeout(r, 300));
    setIsSending(false);

    // 聚焦回输入框
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-lg shadow-primary/5 transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-primary/10 focus-within:shadow-xl">
        {/* 顶部装饰线 */}
        <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="flex items-end gap-3 p-4">
          <div className="relative flex-1 min-w-0">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题，按 Enter 发送..."
              rows={1}
              className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {/* 底部微光 */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isSending}
            className="h-11 w-11 shrink-0 rounded-xl bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary hover:shadow-primary/30 hover:shadow-xl disabled:opacity-40 disabled:shadow-none"
          >
            {isSending ? (
              <Sparkles className="h-4 w-4 animate-pulse" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground/50">
        按 <kbd className="rounded border border-border/50 bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono">Enter</kbd> 发送，
        <kbd className="rounded border border-border/50 bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono">Shift + Enter</kbd> 换行
      </p>
    </form>
  );
}
