from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db, Conversation, Message
from app.models.schemas import ConversationItem, MessageItem

router = APIRouter(prefix="/api/conversations", tags=["会话"])


@router.get("", response_model=list[ConversationItem])
def list_conversations(db: Session = Depends(get_db)):
    """获取会话列表（按更新时间倒序）。"""
    rows = (
        db.query(
            Conversation.id,
            Conversation.title,
            Conversation.created_at,
            func.count(Message.id).label("msg_count"),
        )
        .outerjoin(Message, Message.conversation_id == Conversation.id)
        .group_by(Conversation.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )
    return [
        ConversationItem(
            id=r.id,
            title=r.title,
            created_at=r.created_at.strftime("%Y-%m-%d %H:%M"),
            message_count=r.msg_count,
        )
        for r in rows
    ]


@router.get("/{conversation_id}/messages", response_model=list[MessageItem])
def list_messages(conversation_id: str, db: Session = Depends(get_db)):
    """获取指定会话的消息列表。"""
    rows = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.timestamp.asc())
        .all()
    )
    return [
        MessageItem(
            id=r.id,
            role=r.role,
            content=r.content,
            timestamp=r.timestamp.strftime("%H:%M"),
        )
        for r in rows
    ]
