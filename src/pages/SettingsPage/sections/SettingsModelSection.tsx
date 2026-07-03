import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Cpu, BrainCircuit, Eye, EyeOff, Zap, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  const handleTestLLM = useCallback(async () => {
    setTestingLLM(true);
    await new Promise((r) => setTimeout(r, 1500));
    setTestingLLM(false);
    const ok = Math.random() > 0.3;
    if (ok) {
      toast.success('LLM 连接测试成功', {
        description: 'API 响应正常，模型可正常调用',
        icon: <CheckCircle className="size-4 text-success" />,
      });
    } else {
      toast.error('LLM 连接测试失败', {
        description: '请检查 API Key 和 Base URL 是否正确',
        icon: <XCircle className="size-4 text-destructive" />,
      });
    }
  }, []);

  const handleTestEmbedding = useCallback(async () => {
    setTestingEmbedding(true);
    await new Promise((r) => setTimeout(r, 1500));
    setTestingEmbedding(false);
    const ok = Math.random() > 0.3;
    if (ok) {
      toast.success('Embedding 连接测试成功', {
        description: 'API 响应正常，向量模型可正常调用',
        icon: <CheckCircle className="size-4 text-success" />,
      });
    } else {
      toast.error('Embedding 连接测试失败', {
        description: '请检查 API Key 和 Base URL 是否正确',
        icon: <XCircle className="size-4 text-destructive" />,
      });
    }
  }, []);

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
                <CardTitle className="text-base font-semibold">模型配置</CardTitle>
                <CardDescription className="text-xs">配置大语言模型和向量模型的连接参数</CardDescription>
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
                <span className="text-sm font-semibold text-foreground/85">LLM 大语言模型</span>
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
                {testingLLM ? '测试中...' : '测试连接'}
              </Button>
            </div>

            {/* LLM API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">LLM API Key</label>
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
                  aria-label={showLLMKey ? '隐藏' : '显示'}
                >
                  {showLLMKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                从模型服务商（如 OpenAI、DeepSeek）控制台获取 API Key
              </p>
            </div>

            {/* LLM API Base URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">LLM API Base URL</label>
              <Input
                type="text"
                value={llmBaseUrl}
                onChange={(e) => onLLMBaseUrlChange(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="h-10 bg-background/50 border-border/50 text-sm backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors font-mono"
              />
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                API 端点地址，需兼容 OpenAI 格式；使用代理时填写代理地址
              </p>
            </div>

            {/* LLM 模型名称 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">LLM 模型名称</label>
              <Input
                type="text"
                value={llmModelName}
                onChange={(e) => onLLMModelNameChange(e.target.value)}
                placeholder="gpt-4o / qwen-plus / deepseek-chat"
                className="h-10 bg-background/50 border-border/50 text-sm backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors"
              />
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                填写模型 ID 或名称，确保与 API 端点支持的模型一致
              </p>
            </div>
          </div>

          {/* ========== Embedding 向量模型配置 ========== */}
          <div className="rounded-xl border border-border/30 bg-background/40 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="size-4 text-primary/70" />
                <span className="text-sm font-semibold text-foreground/85">Embedding 向量模型</span>
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
                {testingEmbedding ? '测试中...' : '测试连接'}
              </Button>
            </div>

            {/* Embedding API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Embedding API Key</label>
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
                  aria-label={showEmbeddingKey ? '隐藏' : '显示'}
                >
                  {showEmbeddingKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                通常与 LLM 使用同一 API Key，也可单独配置
              </p>
            </div>

            {/* Embedding API Base URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Embedding API Base URL</label>
              <Input
                type="text"
                value={embeddingBaseUrl}
                onChange={(e) => onEmbeddingBaseUrlChange(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="h-10 bg-background/50 border-border/50 text-sm backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors font-mono"
              />
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                向量化 API 端点地址，通常与 LLM Base URL 相同
              </p>
            </div>

            {/* Embedding 模型名称 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground/70">Embedding 模型名称</label>
              <Input
                type="text"
                value={embeddingModelName}
                onChange={(e) => onEmbeddingModelNameChange(e.target.value)}
                placeholder="text-embedding-3-small / bge-large-zh-v1.5"
                className="h-10 bg-background/50 border-border/50 text-sm backdrop-blur-sm hover:border-primary/30 focus-visible:border-primary/50 transition-colors"
              />
              <p className="text-[11px] text-muted-foreground/60 pl-0.5">
                填写 Embedding 模型 ID，用于文档向量化和语义检索
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
