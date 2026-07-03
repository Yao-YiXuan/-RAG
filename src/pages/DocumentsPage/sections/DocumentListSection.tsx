import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Eye, AlertCircle, Loader2, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';

import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';
import { api } from '@/lib/api';
import type { DocumentItem } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DocumentListSectionProps {
  documents: DocumentItem[];
  onDelete: (id: string) => void;
  loading?: boolean;
}

const STATUS_CONFIG: Record<DocumentItem['status'], { labelKey: TranslationKey; variant: 'default' | 'secondary' | 'destructive'; icon: typeof CheckCircle2 }> = {
  processed: { labelKey: 'doc.status.processed', variant: 'default', icon: CheckCircle2 },
  processing: { labelKey: 'doc.status.processing', variant: 'secondary', icon: Loader2 },
  failed: { labelKey: 'doc.status.failed', variant: 'destructive', icon: AlertCircle },
};

export default function DocumentListSection({ documents, onDelete, loading }: DocumentListSectionProps) {
  const { t } = useI18n();
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);
  const [viewTarget, setViewTarget] = useState<DocumentItem | null>(null);
  const [viewContent, setViewContent] = useState<string | null>(null);
  const [isViewLoading, setIsViewLoading] = useState(false);

  const handleView = async (doc: DocumentItem) => {
    setViewTarget(doc);
    setViewContent(null);
    setIsViewLoading(true);
    try {
      const res = await api.documents.getContent(doc.id);
      setViewContent(res.content);
    } catch (e: any) {
      setViewContent(`读取失败: ${e.message}`);
    } finally {
      setIsViewLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  if (loading && documents.length === 0) {
    return (
      <Card className="border-border/40 bg-card/60 backdrop-blur-xl">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <Loader2 className="size-10 text-muted-foreground/50 animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">{t('doc.loading')}</p>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="border-border/40 bg-card/60 backdrop-blur-xl">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 rounded-full bg-muted/50 p-4">
            <FileText className="size-10 text-muted-foreground/50" />
          </div>
          <p className="text-sm text-muted-foreground">{t('doc.empty.title')}</p>
          <p className="mt-1 text-xs text-muted-foreground/60">{t('doc.empty.desc')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/40 bg-card/60 backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 hover:bg-transparent">
                  <TableHead className="whitespace-nowrap text-muted-foreground">{t('doc.table.name')}</TableHead>
                  <TableHead className="whitespace-nowrap text-muted-foreground">{t('doc.table.uploadTime')}</TableHead>
                  <TableHead className="whitespace-nowrap text-muted-foreground">{t('doc.table.status')}</TableHead>
                  <TableHead className="whitespace-nowrap text-muted-foreground">{t('doc.table.size')}</TableHead>
                  <TableHead className="whitespace-nowrap text-muted-foreground">{t('doc.table.type')}</TableHead>
                  <TableHead className="whitespace-nowrap text-right text-muted-foreground">{t('doc.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {documents.map((doc) => {
                    const statusCfg = STATUS_CONFIG[doc.status];
                    const StatusIcon = statusCfg.icon;
                    return (
                      <motion.tr
                        key={doc.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="border-border/30"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <FileText className="size-4 text-primary" />
                            </div>
                            <span className="block truncate max-w-[200px]">{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
                          {doc.upload_time}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusCfg.variant}
                            className="gap-1 whitespace-nowrap"
                          >
                            <StatusIcon
                              className={`size-3 ${doc.status === 'processing' ? 'animate-spin' : ''}`}
                            />
                            {t(statusCfg.labelKey)}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground tabular-nums">
                          {doc.size}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                              onClick={() => handleView(doc)}
                            >
                              <Eye className="size-3.5" />
                              <span className="hidden sm:inline">{t('doc.table.view')}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1.5 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteTarget(doc)}
                            >
                              <Trash2 className="size-3.5" />
                              <span className="hidden sm:inline">{t('doc.table.delete')}</span>
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="border-border/40 bg-card/90 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('doc.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t('doc.delete.desc', { name: deleteTarget?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/40 bg-secondary/50 hover:bg-secondary/70">
              {t('doc.delete.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('doc.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 查看文档内容对话框 */}
      <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col border-border/40 bg-card/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              {viewTarget?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto min-h-0">
            {isViewLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="size-8 text-primary animate-spin" />
              </div>
            ) : (
              <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
                {viewContent || ''}
              </pre>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
