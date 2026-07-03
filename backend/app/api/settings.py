from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.config import settings as app_settings
from app.database import get_db, SystemSetting
from app.models.schemas import SystemSettings, SaveSettingsResponse
from app.core.llm_client import llm_client


class TestConnectionRequest(BaseModel):
    api_key: str = ""
    base_url: str = ""
    model_name: str = ""


class TestConnectionResponse(BaseModel):
    success: bool
    message: str

router = APIRouter(prefix="/api/settings", tags=["设置"])

# 从 .env 中读取当前实际使用的参数作为默认值
DEFAULT_SETTINGS = {
    "llm_api_key": app_settings.llm_api_key,
    "llm_base_url": app_settings.llm_base_url,
    "llm_model_name": app_settings.llm_model_name,
    "embedding_api_key": app_settings.embedding_api_key,
    "embedding_base_url": app_settings.embedding_base_url,
    "embedding_model_name": app_settings.embedding_model_name,
    "knowledge_base_name": "我的知识库",
    "knowledge_base_description": "",
    "chunk_strategy": "semantic",
    "chunk_size": "512",
    "retrieval_count": "5",
    "similarity_threshold": "0.75",
    "theme": "dark",
    "language": "zh-CN",
}


def _load_settings(db: Session) -> dict:
    """从数据库加载所有设置（缺失的用 .env 中的当前值）。"""
    result = {}
    saved = {row.key: row.value for row in db.query(SystemSetting).all()}
    for key, default in DEFAULT_SETTINGS.items():
        result[key] = saved.get(key, default)
    return result


@router.get("", response_model=SystemSettings)
def get_settings(db: Session = Depends(get_db)):
    """获取所有系统设置。"""
    data = _load_settings(db)
    return SystemSettings(**data)


@router.put("", response_model=SaveSettingsResponse)
def save_settings(settings: SystemSettings, db: Session = Depends(get_db)):
    """保存系统设置。"""
    data = settings.model_dump()
    for key, value in data.items():
        existing = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        if existing:
            existing.value = str(value)
        else:
            db.add(SystemSetting(key=key, value=str(value)))
    db.commit()

    # 更新 LLM 客户端运行时配置
    llm_client.update_config(
        llm_api_key=data.get("llm_api_key"),
        llm_base_url=data.get("llm_base_url"),
        llm_model=data.get("llm_model_name"),
        embedding_api_key=data.get("embedding_api_key"),
        embedding_base_url=data.get("embedding_base_url"),
        embedding_model=data.get("embedding_model_name"),
    )

    return SaveSettingsResponse(success=True)


def _test_connection(api_key: str, base_url: str, model_name: str, mode: str) -> TestConnectionResponse:
    """测试 LLM 或 Embedding 连接。"""
    from openai import OpenAI

    try:
        client = OpenAI(api_key=api_key, base_url=base_url, timeout=10)
        if mode == "llm":
            resp = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=5,
            )
            if resp.choices:
                return TestConnectionResponse(success=True, message="连接成功，模型响应正常")
            return TestConnectionResponse(success=False, message="模型返回为空，请检查模型名称")
        else:
            resp = client.embeddings.create(
                model=model_name,
                input=["test"],
            )
            if resp.data:
                dim = len(resp.data[0].embedding)
                return TestConnectionResponse(success=True, message=f"连接成功，向量维度: {dim}")
            return TestConnectionResponse(success=False, message="模型返回为空，请检查模型名称")
    except Exception as e:
        msg = str(e)
        return TestConnectionResponse(success=False, message=msg)


@router.post("/test-llm", response_model=TestConnectionResponse)
def test_llm_connection(body: TestConnectionRequest):
    """测试 LLM 连接。"""
    api_key = body.api_key or app_settings.llm_api_key
    base_url = body.base_url or app_settings.llm_base_url
    model_name = body.model_name or app_settings.llm_model_name
    return _test_connection(api_key, base_url, model_name, "llm")


@router.post("/test-embedding", response_model=TestConnectionResponse)
def test_embedding_connection(body: TestConnectionRequest):
    """测试 Embedding 连接。"""
    api_key = body.api_key or app_settings.embedding_api_key
    base_url = body.base_url or app_settings.embedding_base_url
    model_name = body.model_name or app_settings.embedding_model_name
    return _test_connection(api_key, base_url, model_name, "embedding")
