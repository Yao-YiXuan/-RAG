import { useState, useRef, type FormEvent } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DocumentUploadSectionProps {
  onUpload: (file: File) => void;
}

const ALLOWED_TYPES = '.pdf,.doc,.docx,.md,.txt,.csv';

export default function DocumentUploadSection({ onUpload }: DocumentUploadSectionProps) {
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      setFileData(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileData) {
      toast.error('请先选择文件');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(fileData);
      setFileName('');
      setFileData(null);
    } catch (e: any) {
      // 错误由父组件处理
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept={ALLOWED_TYPES}
      />

      <Button
        variant="outline"
        onClick={handleFileSelect}
        className="h-11 gap-2 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 backdrop-blur-sm transition-all duration-300"
      >
        <FileText className="size-4" />
        选择文件
      </Button>

      <div className="flex-1 flex items-center gap-2">
        <Input
          value={fileName}
          readOnly
          placeholder="未选择文件（支持 PDF、DOCX、MD、TXT 等格式）"
          className="h-11 bg-card/50 border-border/50 text-muted-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm cursor-default"
        />
      </div>

      <Button
        onClick={handleUpload}
        disabled={isUploading || !fileData}
        className="h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300"
      >
        {isUploading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            上传中...
          </>
        ) : (
          <>
            <Upload className="size-4" />
            上传文档
          </>
        )}
      </Button>
    </div>
  );
}
