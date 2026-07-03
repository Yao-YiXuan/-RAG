import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db, Conversation, Message, SystemSetting
from app.models.schemas import ChatRequest, ChatResponse, SourceRef
from app.core.llm_client import llm_client
from app.core.vector_store import vector_store
from app.core.rag_pipeline import RAGPipeline
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["聊天"])


def _get_rag_settings(db: Session) -> dict:
    """从数据库读取 RAG 相关设置。"""
    settings_map = {}
    for row in db.query(SystemSetting).all():
        settings_map[row.key] = row.value
    return {
        "retrieval_count": int(settings_map.get("retrieval_count", "5")),
        "similarity_threshold": float(settings_map.get("similarity_threshold", "0.45")),
        "llm_api_key": settings_map.get("llm_api_key", settings.llm_api_key),
        "llm_base_url": settings_map.get("llm_base_url", settings.llm_base_url),
        "llm_model_name": settings_map.get("llm_model_name", settings.llm_model_name),
        "embedding_api_key": settings_map.get("embedding_api_key", settings.embedding_api_key),
        "embedding_base_url": settings_map.get("embedding_base_url", settings.embedding_base_url),
        "embedding_model_name": settings_map.get("embedding_model_name", settings.embedding_model_name),
    }


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """发送聊天消息并获取 RAG 回复。"""
    # 1. 获取/创建会话
    conv_id = request.conversation_id
    if not conv_id:
        conv = Conversation(title=request.message[:50])
        db.add(conv)
        db.commit()
        conv_id = conv.id
    else:
        conv = db.query(Conversation).filter(Conversation.id == conv_id).first()
        if not conv:
            conv = Conversation(id=conv_id, title=request.message[:50])
            db.add(conv)
            db.commit()

    # 2. 保存用户消息
    user_msg = Message(
        conversation_id=conv_id,
        role="user",
        content=request.message,
    )
    db.add(user_msg)
    db.commit()

    # 3. 更新对话标题（第一条消息）
    msg_count = db.query(Message).filter(
        Message.conversation_id == conv_id
    ).count()
    if msg_count <= 2:
        conv.title = request.message[:50]
        db.commit()

    # 4. 读取 RAG 设置
    rag_settings = _get_rag_settings(db)

    # 5. 更新 LLM 客户端配置（如果网页端有改动）
    llm_client.update_config(
        llm_api_key=rag_settings.get("llm_api_key"),
        llm_base_url=rag_settings.get("llm_base_url"),
        llm_model=rag_settings.get("llm_model_name"),
        embedding_api_key=rag_settings.get("embedding_api_key"),
        embedding_base_url=rag_settings.get("embedding_base_url"),
        embedding_model=rag_settings.get("embedding_model_name"),
    )

    # 6. 执行 RAG
    pipeline = RAGPipeline(llm_client, vector_store)
    result = pipeline.query(
        question=request.message,
        top_k=int(rag_settings["retrieval_count"]),
        threshold=float(rag_settings["similarity_threshold"]),
    )

    # 7. 保存 AI 回复
    ai_msg = Message(
        conversation_id=conv_id,
        role="assistant",
        content=result["reply"],
    )
    db.add(ai_msg)
    db.commit()

    # 8. 返回
    sources = [
        SourceRef(
            document_name=s["document_name"],
            score=s["score"],
            chunk=s["chunk"],
        )
        for s in result["sources"]
    ]

    return ChatResponse(
        reply=result["reply"],
        conversation_id=conv_id,
        sources=sources,
    )
