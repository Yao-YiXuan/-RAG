// EXPORTS: IDocument, MOCK_DOCUMENTS

export interface IDocument {
  id: string
  name: string
  uploadTime: string
  status: 'processed' | 'processing' | 'failed'
  size: string
  type: string
}

export const MOCK_DOCUMENTS: IDocument[] = [
  {
    id: '1',
    name: '产品需求文档v2.3',
    uploadTime: '2025-01-15 14:30',
    status: 'processed',
    size: '2.4 MB',
    type: 'PDF'
  },
  {
    id: '2',
    name: '技术架构设计',
    uploadTime: '2025-01-14 09:15',
    status: 'processed',
    size: '5.1 MB',
    type: 'DOCX'
  },
  {
    id: '3',
    name: '用户调研报告',
    uploadTime: '2025-01-16 11:20',
    status: 'processing',
    size: '1.8 MB',
    type: 'PDF'
  },
  {
    id: '4',
    name: 'API接口文档',
    uploadTime: '2025-01-13 16:45',
    status: 'failed',
    size: '3.2 MB',
    type: 'MD'
  },
  {
    id: '5',
    name: '部署运维手册',
    uploadTime: '2025-01-12 08:00',
    status: 'processed',
    size: '4.7 MB',
    type: 'PDF'
  }
]