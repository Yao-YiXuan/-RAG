const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `请求失败 (${res.status})`);
  }
  return res.json();
}

export interface SourceRef {
  document_name: string;
  score: number;
  chunk: string;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
  sources: SourceRef[];
}

export interface ConversationItem {
  id: string;
  title: string;
  created_at: string;
  message_count: number;
}

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  upload_time: string;
  status: 'processed' | 'processing' | 'failed';
  size: string;
  type: string;
}

export interface DocumentUploadResponse {
  id: string;
  name: string;
  status: string;
}

export interface SystemSettings {
  llm_api_key: string;
  llm_base_url: string;
  llm_model_name: string;
  embedding_api_key: string;
  embedding_base_url: string;
  embedding_model_name: string;
  knowledge_base_name: string;
  knowledge_base_description: string;
  chunk_strategy: string;
  chunk_size: number;
  retrieval_count: number;
  similarity_threshold: number;
  theme: string;
  language: string;
}

export const api = {
  chat: {
    send: (message: string, conversationId?: string) =>
      request<ChatResponse>('/chat', {
        method: 'POST',
        body: JSON.stringify({ message, conversation_id: conversationId || null }),
      }),
    getConversations: () => request<ConversationItem[]>('/conversations'),
    getMessages: (id: string) => request<MessageItem[]>(`/conversations/${id}/messages`),
  },
  documents: {
    list: (keyword?: string, status?: string) =>
      request<DocumentItem[]>(`/documents?keyword=${encodeURIComponent(keyword || '')}&status=${status || 'all'}`),
    upload: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE}/documents/upload`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      return res.json() as Promise<DocumentUploadResponse>;
    },
    delete: (id: string) => request<{ success: boolean }>(`/documents/${id}`, { method: 'DELETE' }),
  },
  settings: {
    get: () => request<SystemSettings>('/settings'),
    save: (settings: SystemSettings) =>
      request<{ success: boolean }>('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
  },
};
