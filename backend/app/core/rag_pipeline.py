import logging

from app.core.llm_client import LLMClient
from app.core.vector_store import VectorStore

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """你是一个专业的知识库问答助手。你的任务是基于提供的上下文内容回答问题。

规则：
1. 只使用提供的上下文来回答问题
2. 如果上下文不足以回答问题，请明确告知用户
3. 引用来源文档时，在相关陈述后标注 [来源: 文档名]
4. 使用中文回答
5. 回答应简洁、准确、有条理"""


class RAGPipeline:
    """RAG 检索增强生成流程。"""

    def __init__(self, llm_client: LLMClient, vector_store: VectorStore):
        self._llm = llm_client
        self._vs = vector_store

    def query(self, question: str, top_k: int = 5, threshold: float = 0.45) -> dict:
        """执行 RAG 查询。

        Returns:
            dict: {"reply": str, "sources": list[{"document_name", "score", "chunk"}]}
        """
        # 1. 问题向量化
        logger.info("RAG查询: question=%s, top_k=%d, threshold=%.2f", question[:50], top_k, threshold)
        query_embedding = self._llm.embed([question])[0]

        # 2. 检索相关分块
        sources = self._vs.search(query_embedding, top_k=top_k, threshold=threshold)
        logger.info("RAG检索结果: 找到%d个相关片段", len(sources))
        for src in sources:
            logger.info("  - 来源: %s, 相似度: %.4f", src['document_name'], src['score'])

        # 3. 构建上下文
        if sources:
            context_parts = []
            for i, src in enumerate(sources, 1):
                context_parts.append(
                    f"[片段 {i}] 来源: {src['document_name']}\n{src['chunk']}"
                )
            context = "\n\n---\n\n".join(context_parts)

            messages = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"上下文:\n{context}\n\n---\n\n问题: {question}"},
            ]
            logger.info("RAG生成回答: 使用%d个上下文片段", len(sources))
        else:
            # 没有检索到相关内容
            logger.warning("RAG未找到相关文档: question=%s", question[:50])
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"用户问: {question}\n\n"
                        "注意：知识库中没有找到与问题相关的文档内容，"
                        "请如实告知用户目前知识库中暂无相关信息。"
                    ),
                },
            ]

        # 4. 生成回答
        reply = self._llm.chat(messages)
        logger.info("RAG回答完成: 回答长度=%d", len(reply))

        return {
            "reply": reply,
            "sources": sources,
        }
