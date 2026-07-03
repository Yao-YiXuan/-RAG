from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ─── 聊天 ───

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="用户消息")
    conversation_id: Optional[str] = Field(None, description="会话ID，为空则创建新会话")


class SourceRef(BaseModel):
    document_name: str
    score: float
    chunk: str


class ChatResponse(BaseModel):
    reply: str
    conversation_id: str
    sources: list[SourceRef]


# ─── 会话 ───

class ConversationItem(BaseModel):
    id: str
    title: str
    created_at: str
    message_count: int


class MessageItem(BaseModel):
    id: str
    role: str  # user / assistant
    content: str
    timestamp: str


# ─── 文档 ───

class DocumentItem(BaseModel):
    id: str
    name: str
    upload_time: str
    status: str  # processed / processing / failed
    size: str
    type: str


class DocumentUploadResponse(BaseModel):
    id: str
    name: str
    status: str = "processing"


class DeleteResponse(BaseModel):
    success: bool


# ─── 设置 ───

class SystemSettings(BaseModel):
    llm_api_key: str = ""
    llm_base_url: str = "https://api.openai.com/v1"
    llm_model_name: str = "gpt-4o-mini"
    embedding_api_key: str = ""
    embedding_base_url: str = "https://api.openai.com/v1"
    embedding_model_name: str = "text-embedding-3-small"
    knowledge_base_name: str = "我的知识库"
    knowledge_base_description: str = ""
    chunk_strategy: str = "semantic"
    chunk_size: int = 512
    retrieval_count: int = 5
    similarity_threshold: float = 0.75
    theme: str = "dark"
    language: str = "zh-CN"


class SaveSettingsResponse(BaseModel):
    success: bool
