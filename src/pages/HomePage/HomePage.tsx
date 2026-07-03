import { useState, useCallback, useRef } from 'react';
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

export default function HomePage() {
  const { t, lang } = useI18n();
  const [newMessage, setNewMessage] = useState<ChatMessage | null>(null);
  const [aiReply, setAiReply] = useState<ChatMessage | null>(null);
  const conversationIdRef = useRef<string | undefined>(undefined);
  const isSendingRef = useRef(false);

  const handleSend = useCallback(async (text: string) => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;

    const locale = lang === 'en-US' ? 'en-US' : 'zh-CN';
    const ts = new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: ts,
      status: 'sent',
    };
    setNewMessage(userMsg);

    // 启动 thinking 状态
    const thinkingId = `ai-thinking-${Date.now()}`;
    setAiReply({
      id: thinkingId,
      role: 'ai',
      content: '',
      timestamp: '',
      status: 'thinking',
    });

    try {
      const res = await api.chat.send(text, conversationIdRef.current);
      conversationIdRef.current = res.conversation_id;

      setAiReply({
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
        status: 'done',
      });
    } catch (e: any) {
      setAiReply({
        id: `ai-err-${Date.now()}`,
        role: 'ai',
        content: `${t('chat.error.prefix')}: ${e.message || t('error.network')}`,
        timestamp: new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
        status: 'done',
      });
    } finally {
      isSendingRef.current = false;
    }
  }, [lang, t]);

  return (
    <div className="flex flex-col h-full">
      {/* 欢迎区域 */}
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

      {/* 对话消息流 */}
      <ChatSection newMessage={newMessage} aiReply={aiReply} />

      {/* 底部输入区域 */}
      <div className="shrink-0 border-t border-border/20 bg-background/60 backdrop-blur-xl px-4 py-4 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <SuggestionSection onSend={handleSend} />
          <ChatInputSection onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
