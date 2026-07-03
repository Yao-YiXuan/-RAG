import os
import uuid
from datetime import datetime

from sqlalchemy import create_engine, Column, String, Integer, Text, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

os.makedirs(os.path.dirname(settings.sqlite_path) or ".", exist_ok=True)

engine = create_engine(f"sqlite:///{settings.sqlite_path}", echo=False)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


# ─── 模型 ───

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex)
    title = Column(String(200), default="新对话")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex)
    conversation_id = Column(String, index=True, nullable=False)
    role = Column(String(10), nullable=False)  # user / assistant
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.now)


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex)
    name = Column(String(500), nullable=False)
    upload_time = Column(DateTime, default=datetime.now)
    status = Column(String(20), default="processing")  # processing / processed / failed
    size = Column(String(20), default="")
    type = Column(String(20), default="")
    file_path = Column(String(1000), default="")


class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String(100), primary_key=True)
    value = Column(Text, default="")


# ─── 初始化 ───

def init_db():
    Base.metadata.create_all(engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
