from openai import OpenAI
from app.config import settings


class LLMClient:
    """OpenAI 兼容 API 客户端封装，支持动态更新配置。"""

    def __init__(self, api_key: str = "", base_url: str = "", model: str = ""):
        self._api_key = api_key or settings.llm_api_key
        self._base_url = base_url or settings.llm_base_url
        self._model = model or settings.llm_model_name
        self._embedding_api_key = api_key or settings.embedding_api_key
        self._embedding_base_url = base_url or settings.embedding_base_url
        self._embedding_model = settings.embedding_model_name
        self._client = None
        self._embedding_client = None

    def _get_client(self) -> OpenAI:
        if self._client is None:
            self._client = OpenAI(api_key=self._api_key, base_url=self._base_url)
        return self._client

    def _get_embedding_client(self) -> OpenAI:
        if self._embedding_client is None:
            self._embedding_client = OpenAI(
                api_key=self._embedding_api_key,
                base_url=self._embedding_base_url,
            )
        return self._embedding_client

    def update_config(
        self,
        llm_api_key: str = "",
        llm_base_url: str = "",
        llm_model: str = "",
        embedding_api_key: str = "",
        embedding_base_url: str = "",
        embedding_model: str = "",
    ):
        """动态更新配置，重置客户端实例。"""
        if llm_api_key:
            self._api_key = llm_api_key
        if llm_base_url:
            self._base_url = llm_base_url
        if llm_model:
            self._model = llm_model
        if embedding_api_key:
            self._embedding_api_key = embedding_api_key
        if embedding_base_url:
            self._embedding_base_url = embedding_base_url
        if embedding_model:
            self._embedding_model = embedding_model
        # 重置客户端，下次调用时重新创建
        self._client = None
        self._embedding_client = None

    def chat(self, messages: list[dict], model: str = None) -> str:
        """调用 chat/completions 返回回复文本。"""
        client = self._get_client()
        resp = client.chat.completions.create(
            model=model or self._model,
            messages=messages,
            temperature=0.7,
        )
        return resp.choices[0].message.content or ""

    def embed(self, texts: list[str]) -> list[list[float]]:
        """调用 embeddings 返回向量列表。"""
        client = self._get_embedding_client()
        resp = client.embeddings.create(
            model=self._embedding_model,
            input=texts,
        )
        return [item.embedding for item in resp.data]


# 全局单例
llm_client = LLMClient()
