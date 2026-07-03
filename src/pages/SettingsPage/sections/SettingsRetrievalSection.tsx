import { memo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface SettingsRetrievalSectionProps {
  retrievalCount: number;
  similarityThreshold: number;
  onRetrievalCountChange: (value: number) => void;
  onSimilarityThresholdChange: (value: number) => void;
}

export default memo(function SettingsRetrievalSection({
  retrievalCount,
  similarityThreshold,
  onRetrievalCountChange,
  onSimilarityThresholdChange,
}: SettingsRetrievalSectionProps) {
  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <SlidersHorizontal className="size-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">检索设置</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              调整知识库检索的相关参数
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 检索数量 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">检索数量</Label>
            <span className="min-w-[3rem] text-right text-sm font-mono tabular-nums text-primary">
              {retrievalCount}
            </span>
          </div>
          <Slider
            value={[retrievalCount]}
            onValueChange={([v]) => onRetrievalCountChange(v)}
            min={1}
            max={20}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        {/* 相似度阈值 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">相似度阈值</Label>
            <span className="min-w-[3rem] text-right text-sm font-mono tabular-nums text-primary">
              {similarityThreshold.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[similarityThreshold]}
            onValueChange={([v]) => onSimilarityThresholdChange(v)}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>0.00</span>
            <span>1.00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
