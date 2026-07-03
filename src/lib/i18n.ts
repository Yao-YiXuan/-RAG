import * as React from 'react';

export type Language = 'zh-CN' | 'en-US';

export type TranslationKey =
  // Sidebar
  | 'nav.home' | 'nav.documents' | 'nav.settings'
  | 'sidebar.title' | 'sidebar.subtitle'
  // HomePage
  | 'home.title' | 'home.subtitle'
  | 'home.welcome.title' | 'home.welcome.desc'
  // Chat
  | 'chat.placeholder' | 'chat.enter' | 'chat.shiftEnter'
  | 'chat.thinking'
  | 'chat.error.prefix'
  // Suggestion
  | 'suggestion.title'
  | 'suggestion.category.doc_summary' | 'suggestion.category.tech_analysis'
  | 'suggestion.category.data_insight' | 'suggestion.category.api_query'
  | 'suggestion.category.ops_guide'
  // Documents page
  | 'doc.title' | 'doc.description' | 'doc.refresh'
  | 'doc.search.placeholder'
  | 'doc.filter.all' | 'doc.filter.processed' | 'doc.filter.processing' | 'doc.filter.failed'
  | 'doc.upload.select' | 'doc.upload.btn' | 'doc.upload.placeholder' | 'doc.upload.uploading' | 'doc.upload.selectFileFirst'
  | 'doc.table.name' | 'doc.table.uploadTime' | 'doc.table.status' | 'doc.table.size' | 'doc.table.type' | 'doc.table.actions'
  | 'doc.table.view' | 'doc.table.delete'
  | 'doc.status.processed' | 'doc.status.processing' | 'doc.status.failed'
  | 'doc.empty.title' | 'doc.empty.desc'
  | 'doc.delete.title' | 'doc.delete.desc' | 'doc.delete.cancel' | 'doc.delete.confirm'
  | 'doc.loading'
  | 'toast.uploadSuccess' | 'toast.deleteSuccess'
  // Settings
  | 'settings.title' | 'settings.description'
  | 'settings.save' | 'settings.saving' | 'settings.reset' | 'settings.saveSuccess'
  // Model section
  | 'settings.model.title' | 'settings.model.desc'
  | 'settings.model.llm' | 'settings.model.embedding'
  | 'settings.model.test' | 'settings.model.testing'
  | 'settings.model.apiKey' | 'settings.model.baseUrl' | 'settings.model.modelName'
  | 'settings.model.apiKeyDesc' | 'settings.model.apiKeyDescEmbedding'
  | 'settings.model.baseUrlDesc' | 'settings.model.baseUrlDescEmbedding'
  | 'settings.model.modelNameDesc' | 'settings.model.modelNameDescEmbedding'
  | 'settings.model.show' | 'settings.model.hide'
  | 'settings.model.testLLMSuccess' | 'settings.model.testLLMFail'
  | 'settings.model.testEmbeddingSuccess' | 'settings.model.testEmbeddingFail'
  // Knowledge section
  | 'settings.knowledge.title' | 'settings.knowledge.desc'
  | 'settings.knowledge.baseName' | 'settings.knowledge.baseDesc'
  | 'settings.knowledge.chunkStrategy' | 'settings.knowledge.chunkSize'
  | 'settings.knowledge.strategy.fixed' | 'settings.knowledge.strategy.semantic' | 'settings.knowledge.strategy.recursive'
  | 'settings.knowledge.strategy.fixedDesc' | 'settings.knowledge.strategy.semanticDesc' | 'settings.knowledge.strategy.recursiveDesc'
  // Retrieval section
  | 'settings.retrieval.title' | 'settings.retrieval.desc'
  | 'settings.retrieval.count' | 'settings.retrieval.threshold'
  // Appearance section
  | 'settings.appearance.title' | 'settings.appearance.desc'
  | 'settings.appearance.darkMode' | 'settings.appearance.darkDesc' | 'settings.appearance.lightDesc'
  | 'settings.appearance.language' | 'settings.appearance.languageDesc'
  | 'settings.appearance.lang.zh-CN' | 'settings.appearance.lang.en-US'
  // 404
  | '404.message' | '404.back'
  // Error
  | 'error.network'
  // Question examples
  | 'question.example1' | 'question.example2' | 'question.example3' | 'question.example4' | 'question.example5';

const zh: Record<TranslationKey, string> = {
  // Sidebar
  'nav.home': '首页问答',
  'nav.documents': '文档管理',
  'nav.settings': '系统设置',
  'sidebar.title': 'RAG 知识库',
  'sidebar.subtitle': '智能问答系统',
  // HomePage
  'home.title': 'RAG 知识库',
  'home.subtitle': '基于检索增强生成（RAG）的智能文档问答系统。\n上传你的文档，AI 将基于知识库内容为你提供精准、可溯源的回答。',
  'home.welcome.title': '开始提问',
  'home.welcome.desc': '在下方输入你的问题，AI将基于知识库文档为你提供精准回答',
  // Chat
  'chat.placeholder': '输入你的问题，按 Enter 发送...',
  'chat.enter': '发送',
  'chat.shiftEnter': '换行',
  'chat.thinking': '思考中...',
  'chat.error.prefix': '抱歉，请求失败',
  // Suggestion
  'suggestion.title': '试试这些问题',
  'suggestion.category.doc_summary': '文档摘要',
  'suggestion.category.tech_analysis': '技术分析',
  'suggestion.category.data_insight': '数据洞察',
  'suggestion.category.api_query': '接口查询',
  'suggestion.category.ops_guide': '运维指南',
  // Documents
  'doc.title': '文档管理',
  'doc.description': '管理知识库文档，上传、查看和处理状态',
  'doc.refresh': '刷新',
  'doc.search.placeholder': '搜索文档名称...',
  'doc.filter.all': '全部',
  'doc.filter.processed': '已处理',
  'doc.filter.processing': '处理中',
  'doc.filter.failed': '失败',
  'doc.upload.select': '选择文件',
  'doc.upload.btn': '上传文档',
  'doc.upload.placeholder': '未选择文件（支持 PDF、DOCX、MD、TXT 等格式）',
  'doc.upload.uploading': '上传中...',
  'doc.upload.selectFileFirst': '请先选择文件',
  'doc.table.name': '文档名称',
  'doc.table.uploadTime': '上传时间',
  'doc.table.status': '处理状态',
  'doc.table.size': '文件大小',
  'doc.table.type': '类型',
  'doc.table.actions': '操作',
  'doc.table.view': '查看',
  'doc.table.delete': '删除',
  'doc.status.processed': '已处理',
  'doc.status.processing': '处理中',
  'doc.status.failed': '失败',
  'doc.empty.title': '暂无文档',
  'doc.empty.desc': '点击上方按钮上传你的第一个文档',
  'doc.delete.title': '确认删除',
  'doc.delete.desc': '确定要删除文档「{name}」吗？此操作不可撤销。',
  'doc.delete.cancel': '取消',
  'doc.delete.confirm': '确认删除',
  'doc.loading': '加载中...',
  'toast.uploadSuccess': '文档上传成功，正在处理...',
  'toast.deleteSuccess': '文档已删除',
  // Settings
  'settings.title': '系统设置',
  'settings.description': '配置 RAG 知识库的各项参数与偏好',
  'settings.save': '保存设置',
  'settings.saving': '保存中...',
  'settings.reset': '恢复默认',
  'settings.saveSuccess': '设置已保存',
  // Model section
  'settings.model.title': '模型配置',
  'settings.model.desc': '配置大语言模型和向量模型的连接参数',
  'settings.model.llm': 'LLM 大语言模型',
  'settings.model.embedding': 'Embedding 向量模型',
  'settings.model.test': '测试连接',
  'settings.model.testing': '测试中...',
  'settings.model.apiKey': 'API Key',
  'settings.model.baseUrl': 'API Base URL',
  'settings.model.modelName': '模型名称',
  'settings.model.apiKeyDesc': '从模型服务商（如 OpenAI、DeepSeek）控制台获取 API Key',
  'settings.model.apiKeyDescEmbedding': '通常与 LLM 使用同一 API Key，也可单独配置',
  'settings.model.baseUrlDesc': 'API 端点地址，需兼容 OpenAI 格式；使用代理时填写代理地址',
  'settings.model.baseUrlDescEmbedding': '向量化 API 端点地址，通常与 LLM Base URL 相同',
  'settings.model.modelNameDesc': '填写模型 ID 或名称，确保与 API 端点支持的模型一致',
  'settings.model.modelNameDescEmbedding': '填写 Embedding 模型 ID，用于文档向量化和语义检索',
  'settings.model.show': '显示',
  'settings.model.hide': '隐藏',
  'settings.model.testLLMSuccess': 'LLM 连接测试成功',
  'settings.model.testLLMFail': 'LLM 连接测试失败',
  'settings.model.testEmbeddingSuccess': 'Embedding 连接测试成功',
  'settings.model.testEmbeddingFail': 'Embedding 连接测试失败',
  // Knowledge section
  'settings.knowledge.title': '知识库设置',
  'settings.knowledge.desc': '配置知识库基本信息和文档分块策略',
  'settings.knowledge.baseName': '知识库名称',
  'settings.knowledge.baseDesc': '知识库描述',
  'settings.knowledge.chunkStrategy': '分块策略',
  'settings.knowledge.chunkSize': '分块大小',
  'settings.knowledge.strategy.fixed': '固定大小',
  'settings.knowledge.strategy.semantic': '语义分块',
  'settings.knowledge.strategy.recursive': '递归分块',
  'settings.knowledge.strategy.fixedDesc': '按固定字符数切分，简单高效',
  'settings.knowledge.strategy.semanticDesc': '基于语义边界智能切分，保留上下文完整性',
  'settings.knowledge.strategy.recursiveDesc': '递归使用分隔符分层切分，兼顾结构与语义',
  // Retrieval section
  'settings.retrieval.title': '检索设置',
  'settings.retrieval.desc': '调整知识库检索的相关参数',
  'settings.retrieval.count': '检索数量',
  'settings.retrieval.threshold': '相似度阈值',
  // Appearance section
  'settings.appearance.title': '界面设置',
  'settings.appearance.desc': '自定义界面主题和语言偏好',
  'settings.appearance.darkMode': '深色模式',
  'settings.appearance.darkDesc': '当前为深色主题',
  'settings.appearance.lightDesc': '当前为浅色主题',
  'settings.appearance.language': '界面语言',
  'settings.appearance.languageDesc': '选择界面显示语言',
  'settings.appearance.lang.zh-CN': '简体中文',
  'settings.appearance.lang.en-US': 'English',
  // 404
  '404.message': '页面不存在',
  '404.back': '返回首页',
  // Error
  'error.network': '无法连接，请检查网络和配置',
  // Example questions
  'question.example1': '产品需求文档的核心功能有哪些？',
  'question.example2': '技术架构采用了哪些设计模式？',
  'question.example3': '用户调研的主要发现是什么？',
  'question.example4': 'API接口的认证方式是什么？',
  'question.example5': '部署流程有哪些关键步骤？',
};

const en: Record<TranslationKey, string> = {
  // Sidebar
  'nav.home': 'Home',
  'nav.documents': 'Documents',
  'nav.settings': 'Settings',
  'sidebar.title': 'RAG Knowledge Base',
  'sidebar.subtitle': 'Intelligent Q&A',
  // HomePage
  'home.title': 'RAG Knowledge Base',
  'home.subtitle': 'An intelligent document Q&A system based on Retrieval-Augmented Generation (RAG).\nUpload your documents, and AI will provide accurate, traceable answers.',
  'home.welcome.title': 'Ask a Question',
  'home.welcome.desc': 'Type your question below, and AI will provide precise answers based on your knowledge base.',
  // Chat
  'chat.placeholder': 'Type your question, press Enter to send...',
  'chat.enter': 'to send',
  'chat.shiftEnter': 'for new line',
  'chat.thinking': 'Thinking...',
  'chat.error.prefix': 'Sorry, request failed',
  // Suggestion
  'suggestion.title': 'Try asking',
  'suggestion.category.doc_summary': 'Summary',
  'suggestion.category.tech_analysis': 'Tech Analysis',
  'suggestion.category.data_insight': 'Data Insight',
  'suggestion.category.api_query': 'API Query',
  'suggestion.category.ops_guide': 'Operations',
  // Documents
  'doc.title': 'Documents',
  'doc.description': 'Manage knowledge base documents - upload, view, and track processing status',
  'doc.refresh': 'Refresh',
  'doc.search.placeholder': 'Search document name...',
  'doc.filter.all': 'All',
  'doc.filter.processed': 'Processed',
  'doc.filter.processing': 'Processing',
  'doc.filter.failed': 'Failed',
  'doc.upload.select': 'Select File',
  'doc.upload.btn': 'Upload',
  'doc.upload.placeholder': 'No file selected (supports PDF, DOCX, MD, TXT)',
  'doc.upload.uploading': 'Uploading...',
  'doc.upload.selectFileFirst': 'Please select a file first',
  'doc.table.name': 'Name',
  'doc.table.uploadTime': 'Upload Time',
  'doc.table.status': 'Status',
  'doc.table.size': 'Size',
  'doc.table.type': 'Type',
  'doc.table.actions': 'Actions',
  'doc.table.view': 'View',
  'doc.table.delete': 'Delete',
  'doc.status.processed': 'Processed',
  'doc.status.processing': 'Processing',
  'doc.status.failed': 'Failed',
  'doc.empty.title': 'No documents',
  'doc.empty.desc': 'Click the button above to upload your first document',
  'doc.delete.title': 'Confirm Delete',
  'doc.delete.desc': 'Are you sure you want to delete "{name}"? This action cannot be undone.',
  'doc.delete.cancel': 'Cancel',
  'doc.delete.confirm': 'Delete',
  'doc.loading': 'Loading...',
  'toast.uploadSuccess': 'Document uploaded successfully, processing...',
  'toast.deleteSuccess': 'Document deleted',
  // Settings
  'settings.title': 'Settings',
  'settings.description': 'Configure RAG knowledge base parameters and preferences',
  'settings.save': 'Save Settings',
  'settings.saving': 'Saving...',
  'settings.reset': 'Reset',
  'settings.saveSuccess': 'Settings saved',
  // Model section
  'settings.model.title': 'Model Configuration',
  'settings.model.desc': 'Configure LLM and embedding model connection parameters',
  'settings.model.llm': 'LLM',
  'settings.model.embedding': 'Embedding Model',
  'settings.model.test': 'Test Connection',
  'settings.model.testing': 'Testing...',
  'settings.model.apiKey': 'API Key',
  'settings.model.baseUrl': 'API Base URL',
  'settings.model.modelName': 'Model Name',
  'settings.model.apiKeyDesc': 'Get API Key from model provider (e.g. OpenAI, DeepSeek) console',
  'settings.model.apiKeyDescEmbedding': 'Usually uses the same API Key as LLM',
  'settings.model.baseUrlDesc': 'API endpoint URL, must be OpenAI-compatible',
  'settings.model.baseUrlDescEmbedding': 'Embedding API endpoint URL, usually same as LLM Base URL',
  'settings.model.modelNameDesc': 'Enter model ID or name compatible with your API endpoint',
  'settings.model.modelNameDescEmbedding': 'Enter embedding model ID for document vectorization',
  'settings.model.show': 'Show',
  'settings.model.hide': 'Hide',
  'settings.model.testLLMSuccess': 'LLM Connection Successful',
  'settings.model.testLLMFail': 'LLM Connection Failed',
  'settings.model.testEmbeddingSuccess': 'Embedding Connection Successful',
  'settings.model.testEmbeddingFail': 'Embedding Connection Failed',
  // Knowledge section
  'settings.knowledge.title': 'Knowledge Base Settings',
  'settings.knowledge.desc': 'Configure knowledge base info and chunking strategy',
  'settings.knowledge.baseName': 'Knowledge Base Name',
  'settings.knowledge.baseDesc': 'Knowledge Base Description',
  'settings.knowledge.chunkStrategy': 'Chunk Strategy',
  'settings.knowledge.chunkSize': 'Chunk Size',
  'settings.knowledge.strategy.fixed': 'Fixed Size',
  'settings.knowledge.strategy.semantic': 'Semantic',
  'settings.knowledge.strategy.recursive': 'Recursive',
  'settings.knowledge.strategy.fixedDesc': 'Split by fixed character count, simple and efficient',
  'settings.knowledge.strategy.semanticDesc': 'Split intelligently at semantic boundaries, preserves context',
  'settings.knowledge.strategy.recursiveDesc': 'Split recursively using separators, balances structure and semantics',
  // Retrieval section
  'settings.retrieval.title': 'Retrieval Settings',
  'settings.retrieval.desc': 'Adjust knowledge retrieval parameters',
  'settings.retrieval.count': 'Retrieval Count',
  'settings.retrieval.threshold': 'Similarity Threshold',
  // Appearance section
  'settings.appearance.title': 'Appearance',
  'settings.appearance.desc': 'Customize theme and language preferences',
  'settings.appearance.darkMode': 'Dark Mode',
  'settings.appearance.darkDesc': 'Dark theme active',
  'settings.appearance.lightDesc': 'Light theme active',
  'settings.appearance.language': 'Language',
  'settings.appearance.languageDesc': 'Select interface language',
  'settings.appearance.lang.zh-CN': '简体中文',
  'settings.appearance.lang.en-US': 'English',
  // 404
  '404.message': 'Page not found',
  '404.back': 'Back to Home',
  // Error
  'error.network': 'Unable to connect, please check network and configuration',
  // Example questions
  'question.example1': 'What are the core features of the PRD?',
  'question.example2': 'What design patterns does the architecture use?',
  'question.example3': 'What are the key findings from user research?',
  'question.example4': 'What is the API authentication method?',
  'question.example5': 'What are the key deployment steps?',
};

const translations: Record<Language, Record<TranslationKey, string>> = { 'zh-CN': zh, 'en-US': en };

// Context
interface I18nContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

const I18nContext = React.createContext<I18nContextValue>(null!);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Language>(() => {
    return (localStorage.getItem('app-lang') as Language) || 'zh-CN';
  });

  const t = React.useCallback((key: TranslationKey, params?: Record<string, string>) => {
    let text = translations[lang][key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
      }
    }
    return text;
  }, [lang]);

  const value = React.useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return React.createElement(I18nContext.Provider, { value }, children);
}

export function useI18n() {
  return React.useContext(I18nContext);
}

export function getDefaultLanguage(): Language {
  return (localStorage.getItem('app-lang') as Language) || 'zh-CN';
}
