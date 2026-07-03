from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db, SystemSetting
from app.models.schemas import SystemSettings, SaveSettingsResponse
from app.core.llm_client import llm_client

router = APIRouter(prefix="/api/settings", tags=["设置"])

# 所有设置的默认值
DEFAULT_SETTINGS = {
    "llm_api_key": "",
    "llm_base_url": "https://api.openai.com/v1",
    "llm_model_name": "gpt-4o-mini",
    "embedding_api_key": "",
    "embedding_base_url": "https://api.openai.com/v1",
    "embedding_model_name": "text-embedding-3-small",
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
    """从数据库加载所有设置（缺失的用默认值）。"""
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
