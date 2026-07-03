// EXPORTS: IChatMessage, MOCK_CHAT_MESSAGES

export interface IChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
  status?: 'sending' | 'sent' | 'thinking' | 'done'
}

export const MOCK_CHAT_MESSAGES: IChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    content: '你好！我是你的知识库助手，可以帮你检索和分析已上传的文档内容，有什么问题尽管问我。',
    timestamp: '10:00',
    status: 'done'
  },
  {
    id: '2',
    role: 'user',
    content: '帮我总结一下产品需求文档的核心功能点',
    timestamp: '10:02',
    status: 'sent'
  },
  {
    id: '3',
    role: 'ai',
    content: '根据文档分析，核心功能包括：用户认证、数据看板、智能搜索和报表导出四大模块。',
    timestamp: '10:02',
    status: 'done'
  }
]