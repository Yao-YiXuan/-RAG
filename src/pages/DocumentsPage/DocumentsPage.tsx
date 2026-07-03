import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { useI18n } from '@/lib/i18n';
import { api, DocumentItem as ApiDocumentItem } from '@/lib/api';
import DocumentFilterSection from './sections/DocumentFilterSection';
import DocumentUploadSection from './sections/DocumentUploadSection';
import DocumentListSection from './sections/DocumentListSection';
import { Button } from '@/components/ui/button';

export default function DocumentsPage() {
  const { t } = useI18n();
  const [documents, setDocuments] = useState<ApiDocumentItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.documents.list(keyword, statusFilter);
      setDocuments(data);
    } catch (e: any) {
      toast.error('加载文档列表失败', { description: e.message });
    } finally {
      setLoading(false);
    }
  }, [keyword, statusFilter]);

  // 初始加载 + 筛选变化时重新加载
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = useCallback(async (file: File) => {
    try {
      await api.documents.upload(file);
      toast.success(t('toast.uploadSuccess'));
      fetchDocuments();
    } catch (e: any) {
      toast.error('上传失败', { description: e.message });
    }
  }, [fetchDocuments, t]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.documents.delete(id);
      toast.success(t('toast.deleteSuccess'));
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (e: any) {
      toast.error('删除失败', { description: e.message });
    }
  }, [t]);

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <FileText className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {t('doc.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('doc.description')}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchDocuments}
          disabled={loading}
          className="gap-1.5 text-muted-foreground"
        >
          <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          {t('doc.refresh')}
        </Button>
      </motion.div>

      {/* 上传区域 */}
      <DocumentUploadSection onUpload={handleUpload} />

      {/* 搜索筛选 */}
      <DocumentFilterSection
        keyword={keyword}
        onKeywordChange={setKeyword}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* 文档列表 */}
      <DocumentListSection
        documents={documents}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
