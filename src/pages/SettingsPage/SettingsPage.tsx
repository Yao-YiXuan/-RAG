import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { api, type SystemSettings as ApiSystemSettings } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

import SettingsModelSection from './sections/SettingsModelSection';
import SettingsKnowledgeSection from './sections/SettingsKnowledgeSection';
import SettingsRetrievalSection from './sections/SettingsRetrievalSection';
import SettingsAppearanceSection from './sections/SettingsAppearanceSection';

const DEFAULT_SETTINGS: ApiSystemSettings = {
  llm_api_key: '',
  llm_base_url: 'https://api.openai.com/v1',
  llm_model_name: 'gpt-4o-mini',
  embedding_api_key: '',
  embedding_base_url: 'https://api.openai.com/v1',
  embedding_model_name: 'text-embedding-3-small',
  knowledge_base_name: '我的知识库',
  knowledge_base_description: '',
  chunk_strategy: 'semantic',
  chunk_size: 512,
  retrieval_count: 5,
  similarity_threshold: 0.45,
  theme: 'dark',
  language: 'zh-CN',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<ApiSystemSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t, setLang, lang } = useI18n();

  // 初始加载设置
  useEffect(() => {
    setIsLoading(true);
    api.settings.get()
      .then((data) => {
        // 用 localStorage 保存的主题覆盖 API 返回的值（跨页面持久化）
        const localTheme = localStorage.getItem('app-theme');
        if (localTheme === 'light' || localTheme === 'dark') {
          data.theme = localTheme;
        }
        // 用 I18nProvider 当前语言覆盖 API 返回的值（跨页面持久化）
        data.language = lang;
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      })
      .catch(() => toast.error('加载设置失败，使用默认配置'))
      .finally(() => setIsLoading(false));
  }, []);

  const update = useCallback(<K extends keyof ApiSystemSettings>(key: K, value: ApiSystemSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await api.settings.save(settings);
      toast.success(t('settings.saveSuccess'), {
        description: '所有配置项已成功更新',
        icon: <Check className="size-4 text-success" />,
      });
    } catch (e: any) {
      toast.error('保存失败', { description: e.message });
    } finally {
      setIsSaving(false);
    }
  }, [settings, t]);

  const handleReset = useCallback(() => {
    api.settings.get()
      .then((data) => {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
        // 恢复默认后同步主题到 DOM + localStorage
        const defaultTheme = (data.theme as 'dark' | 'light') || 'dark';
        document.documentElement.setAttribute('data-theme', defaultTheme);
        localStorage.setItem('app-theme', defaultTheme);
      })
      .then(() => toast.info('已恢复默认设置'))
      .catch(() => toast.error('恢复默认失败'));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t('settings.title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('settings.description')}
        </p>
      </motion.div>

      {/* 设置分组 */}
      <div className="space-y-5">
        <SettingsModelSection
          llmApiKey={settings.llm_api_key}
          llmBaseUrl={settings.llm_base_url}
          llmModelName={settings.llm_model_name}
          onLLMApiKeyChange={(v) => update('llm_api_key', v)}
          onLLMBaseUrlChange={(v) => update('llm_base_url', v)}
          onLLMModelNameChange={(v) => update('llm_model_name', v)}
          embeddingApiKey={settings.embedding_api_key}
          embeddingBaseUrl={settings.embedding_base_url}
          embeddingModelName={settings.embedding_model_name}
          onEmbeddingApiKeyChange={(v) => update('embedding_api_key', v)}
          onEmbeddingBaseUrlChange={(v) => update('embedding_base_url', v)}
          onEmbeddingModelNameChange={(v) => update('embedding_model_name', v)}
        />

        <SettingsKnowledgeSection
          knowledgeBaseName={settings.knowledge_base_name}
          knowledgeBaseDescription={settings.knowledge_base_description}
          chunkStrategy={settings.chunk_strategy as 'fixed' | 'semantic' | 'recursive'}
          chunkSize={settings.chunk_size}
          onKnowledgeBaseNameChange={(v) => update('knowledge_base_name', v)}
          onKnowledgeBaseDescriptionChange={(v) => update('knowledge_base_description', v)}
          onChunkStrategyChange={(v) => update('chunk_strategy', v)}
          onChunkSizeChange={(v) => update('chunk_size', v)}
        />

        <SettingsRetrievalSection
          retrievalCount={settings.retrieval_count}
          similarityThreshold={settings.similarity_threshold}
          onRetrievalCountChange={(v) => update('retrieval_count', v)}
          onSimilarityThresholdChange={(v) => update('similarity_threshold', v)}
        />

        <SettingsAppearanceSection
          theme={settings.theme as 'dark' | 'light'}
          language={settings.language}
          onThemeChange={(v) => {
            update('theme', v);
            document.documentElement.setAttribute('data-theme', v);
            localStorage.setItem('app-theme', v);
          }}
          onLanguageChange={(v) => {
            update('language', v);
            setLang(v as 'zh-CN' | 'en-US');
            localStorage.setItem('app-lang', v);
          }}
        />
      </div>

      {/* 底部固定操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/30 bg-background/70 backdrop-blur-xl">
        <div className="flex items-center justify-end gap-3 px-4 py-3 lg:px-6">
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-10 gap-2 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200"
          >
            <RotateCcw className="size-4" />
            {t('settings.reset')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 transition-all duration-200"
          >
            {isSaving ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Save className="size-4" />
                </motion.span>
                {t('settings.saving')}
              </>
            ) : (
              <>
                <Save className="size-4" />
                {t('settings.save')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
