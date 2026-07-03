import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import type { ChatMessage } from '../HomePage';

interface ChatSectionProps {
  newMessage?: ChatMessage | null;
  aiReply?: ChatMessage | null;
}

export default function ChatSection({ newMessage, aiReply }: ChatSectionProps) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiReply, scrollToBottom]);

  // 追加用户新消息
  useEffect(() => {
    if (newMessage) {
      setMessages(prev => [...prev, newMessage]);
    }
  }, [newMessage]);

  // 处理 AI 回复（thinking 状态或最终回复）
  useEffect(() => {
    if (!aiReply) return;
    setMessages(prev => {
      // 如果最后一条是 thinking，替换掉它
      const last = prev[prev.length - 1];
      if (last?.status === 'thinking') {
        return [...prev.slice(0, -1), aiReply];
      }
      return [...prev, aiReply];
    });
  }, [aiReply]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin">
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center h-full text-center px-4"
        >
          <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
            <Sparkles className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {t('home.welcome.title')}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {t('home.welcome.desc')}
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
            >
              {/* AI 头像 */}
              {!isUser && (
                <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="size-4 text-primary" />
                </div>
              )}

              {/* 消息气泡 */}
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  isUser
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card/60 backdrop-blur-xl border border-border/40 text-foreground rounded-bl-md shadow-sm',
                )}
              >
                {msg.status === 'thinking' ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">{t('chat.thinking')}</span>
                    <span className="flex gap-1">
                      <motion.span
                        className="size-1.5 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="size-1.5 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.span
                        className="size-1.5 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                      />
                    </span>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
              </div>

              {/* 用户头像 */}
              {isUser && (
                <div className="size-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="size-4 text-primary" />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
