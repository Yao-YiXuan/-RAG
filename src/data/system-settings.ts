// EXPORTS: ISystemSettings, MOCK_SYSTEM_SETTINGS

export interface ISystemSettings {
  llmApiKey: string
  llmBaseUrl: string
  llmModelName: string
  embeddingApiKey: string
  embeddingBaseUrl: string
  embeddingModelName: string
  knowledgeBaseName: string
  knowledgeBaseDescription: string
  chunkStrategy: 'fixed' | 'semantic' | 'recursive'
  chunkSize: number
  retrievalCount: number
  similarityThreshold: number
  theme: 'dark' | 'light'
  language: string
}

export const MOCK_SYSTEM_SETTINGS: ISystemSettings = {
  llmApiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  llmBaseUrl: 'https://api.openai.com/v1',
  llmModelName: 'gpt-4o',
  embeddingApiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  embeddingBaseUrl: 'https://api.openai.com/v1',
  embeddingModelName: 'text-embedding-3-small',
  knowledgeBaseName: '我的知识库',
  knowledgeBaseDescription: '个人技术文档与学习资料汇总',
  chunkStrategy: 'semantic',
  chunkSize: 512,
  retrievalCount: 5,
  similarityThreshold: 0.75,
  theme: 'dark',
  language: 'zh-CN'
}