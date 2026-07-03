// EXPORTS: ISuggestionQuestion, MOCK_SUGGESTION_QUESTIONS

export interface ISuggestionQuestion {
  id: string
  text: string
  category: string
}

export const MOCK_SUGGESTION_QUESTIONS: ISuggestionQuestion[] = [
  {
    id: '1',
    text: '产品需求文档的核心功能有哪些？',
    category: '文档摘要'
  },
  {
    id: '2',
    text: '技术架构采用了哪些设计模式？',
    category: '技术分析'
  },
  {
    id: '3',
    text: '用户调研的主要发现是什么？',
    category: '数据洞察'
  },
  {
    id: '4',
    text: 'API接口的认证方式是什么？',
    category: '接口查询'
  },
  {
    id: '5',
    text: '部署流程有哪些关键步骤？',
    category: '运维指南'
  }
]