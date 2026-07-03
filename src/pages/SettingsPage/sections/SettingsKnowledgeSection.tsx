import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Hash, FileText, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MOCK_SYSTEM_SETTINGS } from '@/data/system-settings';

interface SettingsKnowledgeSectionProps {
  knowledgeBaseName: string;
  knowledgeBaseDescription: string;
  chunkStrategy: 'fixed' | 'semantic' | 'recursive';
  chunkSize: number;
  onKnowledgeBaseNameChange: (value: string) => void;
  onKnowledgeBaseDescriptionChange: (value: string) => void;
  onChunkStrategyChange: (value: 'fixed' | 'semantic' | 'recursive') => void;
  onChunkSizeChange: (value: number) => void;
}

const CHUNK_STRATEGY_OPTIONS: { value: 'fixed' | 'semantic' | 'recursive'; label: string; desc: string }[] = [
  { value: 'fixed', label: '固定大小', desc: '按固定字符数切分，简单高效' },
  { value: 'semantic', label: '语义分块', desc: '基于语义边界智能切分，保留上下文完整性' },
  { value: 'recursive', label: '递归分块', desc: '递归使用分隔符分层切分，兼顾结构与语义' },
];

export default function SettingsKnowledgeSection({
  knowledgeBaseName,
  knowledgeBaseDescription,
  chunkStrategy,
  chunkSize,
  onKnowledgeBaseNameChange,
  onKnowledgeBaseDescriptionChange,
  onChunkStrategyChange,
  onChunkSizeChange,
}: SettingsKnowledgeSectionProps) {
  const [chunkSizeInput, setChunkSizeInput] = useState(String(chunkSize));

  const handleChunkSizeBlur = () => {
    const parsed = parseInt(chunkSizeInput, 10);
    if (isNaN(parsed) || parsed < 64) {
      setChunkSizeInput('64');
      onChunkSizeChange(64);
    } else if (parsed > 4096) {
      setChunkSizeInput('4096');
      onChunkSizeChange(4096);
    } else {
      onChunkSizeChange(parsed);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Database className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">知识库设置</CardTitle>
              <CardDescription className="text-xs">配置知识库基本信息与文档处理策略</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* 知识库名称 */}
          <div className="space-y-2">
            <Label htmlFor="kb-name" className="flex items-center gap-1.5 text-sm">
              <FileText className="size-3.5 text-muted-foreground" />
              知识库名称
            </Label>
            <Input
              id="kb-name"
              value={knowledgeBaseName}
              onChange={(e) => onKnowledgeBaseNameChange(e.target.value)}
              placeholder="输入知识库名称"
              className="bg-background/50 border-border/50 focus-visible:ring-primary/40"
            />
          </div>

          {/* 知识库描述 */}
          <div className="space-y-2">
            <Label htmlFor="kb-desc" className="flex items-center gap-1.5 text-sm">
              <FileText className="size-3.5 text-muted-foreground" />
              知识库描述
            </Label>
            <Textarea
              id="kb-desc"
              value={knowledgeBaseDescription}
              onChange={(e) => onKnowledgeBaseDescriptionChange(e.target.value)}
              placeholder="简要描述知识库的内容和用途"
              rows={3}
              className="resize-none bg-background/50 border-border/50 focus-visible:ring-primary/40"
            />
          </div>

          {/* 分块策略 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm">
              <Hash className="size-3.5 text-muted-foreground" />
              分块策略
            </Label>
            <Select
              value={chunkStrategy}
              onValueChange={(v) => onChunkStrategyChange(v as 'fixed' | 'semantic' | 'recursive')}
            >
              <SelectTrigger className="bg-background/50 border-border/50 focus:ring-primary/40">
                <SelectValue placeholder="选择分块策略" />
              </SelectTrigger>
              <SelectContent className="border-border/60 bg-card/95 backdrop-blur-xl">
                {CHUNK_STRATEGY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 分块大小 */}
          <div className="space-y-2">
            <Label htmlFor="chunk-size" className="flex items-center gap-1.5 text-sm">
              <Hash className="size-3.5 text-muted-foreground" />
              分块大小
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {chunkSize} 字符
              </span>
            </Label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={64}
                max={4096}
                step={64}
                value={chunkSize}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  onChunkSizeChange(v);
                  setChunkSizeInput(String(v));
                }}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted/60 accent-primary [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(0_180_216_0.4)] [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <Input
                id="chunk-size"
                type="number"
                min={64}
                max={4096}
                value={chunkSizeInput}
                onChange={(e) => setChunkSizeInput(e.target.value)}
                onBlur={handleChunkSizeBlur}
                className="w-24 bg-background/50 border-border/50 text-center tabular-nums focus-visible:ring-primary/40"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              范围 64 ~ 4096 字符，推荐 256 ~ 1024
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
