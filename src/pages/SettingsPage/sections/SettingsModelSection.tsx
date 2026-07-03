import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Cpu, BrainCircuit, Eye, EyeOff, Zap, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

interface SettingsModelSectionProps {
  // LLM
  llmApiKey: string;
  llmBaseUrl: string;
  llmModelName: string;
  onLLMApiKeyChange: (value: string) => void;
  onLLMBaseUrlChange: (value: string) => void;
  onLLMModelNameChange: (value: string) => void;
  // Embedding
  embeddingApiKey: string;
  embeddingBaseUrl: string;
  embeddingModelName: string;
  onEmbeddingApiKeyChange: (value: string) => void;
  onEmbeddingBaseUrlChange: (value: string) => void;
  onEmbeddingModelNameChange: (value: string) => void;
}

export default function SettingsModelSection({
  llmApiKey,
  llmBaseUrl,
  llmModelName,
  onLLMApiKeyChange,
  onLLMBaseUrlChange,
  onLLMModelNameChange,
  embeddingApiKey,
  embeddingBaseUrl,
  embeddingModelName,
  onEmbeddingApiKeyChange,
  onEmbeddingBaseUrlChange,
  onEmbeddingModelNameChange,
}: SettingsModelSectionProps) {
  const [showLLMKey, setShowLLMKey] = useState(false);
  const [showEmbeddingKey, setShowEmbeddingKey] = useState(false);
  const [testingLLM, setTestingLLM] = useState(false);
  const [testingEmbedding, setTestingEmbedding] = useState(false);
  const { t } = useI18n();

  const handleTestLLM = useCallback(async () => {
    console.log('[test] LLM test clicked', { llmApiKey, llmBaseUrl, llmModelName });
    setTestingLLM(true);
    try {
      const res = await api.settings.testLLM(
        llmApiKey,
        llmBaseUrl,
        llmModelName,
      );
      console.log('[test] LLM result:', res);
      if (res.success) {
        toast.success(t('settings.model.testLLMSuccess'), {
          description: res.message,
        });
      } else {
        toast.error(t('settings.model.testLLMFail'), {
          description: res.message,
        });
      }
    } catch (e: any) {
      console.error('[test] LLM error:', e);
      toast.error(t('settings.model.testLLMFail'), {
        description: e.message || t('error.network'),
      });
    } finally {
      setTestingLLM(false);
    }
  }, [llmApiKey, llmBaseUrl, llmModelName, t]);

  const handleTestEmbedding = useCallback(async () => {
    console.log('[test] Embedding test clicked', { embeddingApiKey, embeddingBaseUrl, embeddingModelName });
    setTestingEmbedding(true);
    try {
      const res = await api.settings.testEmbedding(
        embeddingApiKey,
        embeddingBaseUrl,
        embeddingModelName,
      );
      console.log('[test] Embedding result:', res);
      if (res.success) {
        toast.success(t('settings.model.testEmbeddingSuccess'), {
          description: res.message,
        });
      } else {
        toast.error(t('settings.model.testEmbeddingFail'), {
          description: res.message,
        });
      }
    } catch (e: any) {
      console.error('[test] Embedding error:', e);
      toast.error(t('settings.model.testEmbeddingFail'), {
        description: e.message || t('error.network'),
      });
    } finally {
      setTestingEmbedding(false);
    }
  }, [embeddingApiKey, embeddingBaseUrl, embeddingModelName, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Cpu className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{t('settings.model.title')}</CardTitle>
                <CardDescription className="text-xs">{t('settings.model.desc')}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ========== LLM 大语言模型配置 ========== */}
          <div className="rounded-xl border border-border/30 bg-background/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="size-4 text-primary/70" />
                <span className="text-sm font-semibold text-foreground/85">{t('settings.model.llm')}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={testingLLM}
                onClick={handleTestLLM}
                className="h-8 gap-1.5 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 text-xs"
              >
                {testingLLM ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Zap className="size-3" />
                )}
                {testingLLM ? t('settings.model.testing') : t('settings.model.test')}
              </Button>
            </div>

            {/* LLM API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">LLM {t('settings.model.apiKey')}</label>
              <div className="relative">
                <Input
                  type={showLLMKey ? 'text' : 'password'}
                  value={llmApiKey}
                  onChange={(e) => onLLMApiKeyChange(e.target.value)}
                  placeholder="sk-..."
                  className="h-10 bg-background/50 border-border/50 text-sm pr-10 backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors font-mono"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="!absolute right-1 top-1/2 z-20 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowLLMKey(!showLLMKey)}
                  aria-label={showLLMKey ? t('settings.model.hide') : t('settings.model.show')}
                >
                  {showLLMKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                {t('settings.model.apiKeyDesc')}
              </p>
            </div>

            {/* LLM API Base URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">LLM {t('settings.model.baseUrl')}</label>
              <Input
                type="text"
                value={llmBaseUrl}
                onChange={(e) => onLLMBaseUrlChange(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="h-10 bg-background/50 border-border/50 text-sm backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors font-mono"
              />
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                {t('settings.model.baseUrlDesc')}
              </p>
            </div>

            {/* LLM 模型名称 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">LLM {t('settings.model.modelName')}</label>
              <Input
                type="text"
                value={llmModelName}
                onChange={(e) => onLLMModelNameChange(e.target.value)}
                placeholder="gpt-4o / qwen-plus / deepseek-chat"
                className="h-10 bg-background/50 border-border/50 text-sm backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors"
              />
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                {t('settings.model.modelNameDesc')}
              </p>
            </div>
          </div>

          {/* ========== Embedding 向量模型配置 ========== */}
          <div className="rounded-xl border border-border/30 bg-background/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-primary/70" />
                <span className="text-sm font-semibold text-foreground/85">{t('settings.model.embedding')}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={testingEmbedding}
                onClick={handleTestEmbedding}
                className="h-8 gap-1.5 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 text-xs"
              >
                {testingEmbedding ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Zap className="size-3" />
                )}
                {testingEmbedding ? t('settings.model.testing') : t('settings.model.test')}
              </Button>
            </div>

            {/* Embedding API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Embedding {t('settings.model.apiKey')}</label>
              <div className="relative">
                <Input
                  type={showEmbeddingKey ? 'text' : 'password'}
                  value={embeddingApiKey}
                  onChange={(e) => onEmbeddingApiKeyChange(e.target.value)}
                  placeholder="sk-..."
                  className="h-10 bg-background/50 border-border/50 text-sm pr-10 backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors font-mono"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="!absolute right-1 top-1/2 z-20 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowEmbeddingKey(!showEmbeddingKey)}
                  aria-label={showEmbeddingKey ? t('settings.model.hide') : t('settings.model.show')}
                >
                  {showEmbeddingKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                {t('settings.model.apiKeyDescEmbedding')}
              </p>
            </div>

            {/* Embedding API Base URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Embedding {t('settings.model.baseUrl')}</label>
              <Input
                type="text"
                value={embeddingBaseUrl}
                onChange={(e) => onEmbeddingBaseUrlChange(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="h-10 bg-background/50 border-border/50 text-sm backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors font-mono"
              />
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                {t('settings.model.baseUrlDescEmbedding')}
              </p>
            </div>

            {/* Embedding 模型名称 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Embedding {t('settings.model.modelName')}</label>
              <Input
                type="text"
                value={embeddingModelName}
                onChange={(e) => onEmbeddingModelNameChange(e.target.value)}
                placeholder="text-embedding-3-small / bge-large-zh-v1.5"
                className="h-10 bg-background/50 border-border/50 text-sm backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors"
              />
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                {t('settings.model.modelNameDescEmbedding')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
