import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import ChatSection from './sections/ChatSection';
import ChatInputSection from './sections/ChatInputSection';
import SuggestionSection from './sections/SuggestionSection';
import { api } from '@/lib/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'thinking' | 'done';
}

const STORAGE_KEY = 'last-conversation-id';

export default function HomePage() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const conversationIdRef = useRef<string | null>(null);
  const locale = lang === 'en-US' ? 'en-US' : 'zh-CN';

  // 挂载时：从 localStorage 恢复 conversation_id，从后端加载消息
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId) {
      conversationIdRef.current = savedId;
      api.chat.getMessages(savedId)
        .then((msgs) => {
          setMessages(
            msgs.map((m) => ({
              id: m.id,
              role: m.role === 'assistant' ? 'ai' : 'user',
              content: m.content,
              timestamp: m.timestamp,
              status: 'done' as const,
            })),
          );
        })
        .catch(() => {
          // 会话已失效，清除
          localStorage.removeItem(STORAGE_KEY);
          conversationIdRef.current = null;
        })
        .finally(() => setIsLoadingHistory(false));
    } else {
      setIsLoadingHistory(false);
    }
  }, []);

  const handleSend = useCallback(async (text: string) => {
    if (isSending) return;
    setIsSending(true);

    const ts = new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

    // 追加用户消息
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: ts,
      status: 'sent',
    };
    setMessages((prev) => [...prev, userMsg]);

    // 追加 thinking 占位
    const thinkingId = `ai-thinking-${Date.now()}`;
    const thinkingMsg: ChatMessage = {
      id: thinkingId,
      role: 'ai',
      content: '',
      timestamp: '',
      status: 'thinking',
    };
    setMessages((prev) => [...prev, thinkingMsg]);

    try {
      const res = await api.chat.send(text, conversationIdRef.current || undefined);
      conversationIdRef.current = res.conversation_id;
      localStorage.setItem(STORAGE_KEY, res.conversation_id);

      // 替换 thinking 为真实回复
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === thinkingId);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy[idx] = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
          status: 'done',
        };
        return copy;
      });
    } catch (e: any) {
      // 替换 thinking 为错误消息
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === thinkingId);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy[idx] = {
          id: `ai-err-${Date.now()}`,
          role: 'ai',
          content: `${t('chat.error.prefix')}: ${e.message || t('error.network')}`,
          timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
          status: 'done',
        };
        return copy;
      });
    } finally {
      setIsSending(false);
    }
  }, [isSending, locale, t]);

  return (
    <div className="flex flex-col h-full">
      {/* 顶部欢迎区域（仅当没有消息时展示） */}
      {messages.length === 0 && !isLoadingHistory && (
        <div className="shrink-0 px-4 pt-8 pb-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-primary/20 shadow-lg shadow-primary/10">
              <Sparkles className="size-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {t('home.title')}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {t('home.subtitle')}
            </p>
          </motion.div>
        </div>
      )}

      {/* 对话消息流 */}
      <ChatSection messages={messages} isLoading={isLoadingHistory} />

      {/* 底部输入区域 */}
      <div className="shrink-0 border-t border-border/20 bg-background/60 backdrop-blur-xl px-4 py-4 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && !isLoadingHistory && (
            <SuggestionSection onSend={handleSend} />
          )}
          <ChatInputSection onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
