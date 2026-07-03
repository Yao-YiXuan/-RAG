import os
import logging
import chromadb
from chromadb.config import Settings as ChromaSettings

from app.config import settings

logger = logging.getLogger(__name__)


COLLECTION_NAME = "rag_documents"


class VectorStore:
    """ChromaDB 向量存储封装。"""

    def __init__(self, persist_dir: str = ""):
        self._persist_dir = persist_dir or settings.chroma_db_path
        os.makedirs(self._persist_dir, exist_ok=True)
        self._client = chromadb.PersistentClient(
            path=self._persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        # 获取或创建 collection
        self._collection = self._client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )

    def add_document(
        self,
        doc_id: str,
        chunks: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict],
    ):
        """添加文档分块到向量库。"""
        ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
        self._collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
        threshold: float = 0.45,
    ) -> list[dict]:
        """检索最相似的分块。"""
        total = self._collection.count()
        logger.info("向量库检索: 库中共%d个分块, top_k=%d, threshold=%.2f", total, top_k, threshold)

        results = self._collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
        )

        items = []
        if not results["ids"] or not results["ids"][0]:
            logger.warning("向量库检索结果为空")
            return items

        logger.info("向量库原始返回: %d条结果", len(results["ids"][0]))
        for i in range(len(results["ids"][0])):
            distance = results["distances"][0][i] if results["distances"] else 1.0
            score = 1 - distance
            doc_name = (results["metadatas"][0][i] or {}).get("name", "未知")
            logger.info("  - 候选[%d]: 文档=%s, distance=%.4f, score=%.4f, threshold_check=%s",
                       i, doc_name, distance, score, "通过" if score >= threshold else "过滤")
            if score < threshold:
                continue
            items.append({
                "document_name": doc_name,
                "score": round(score, 4),
                "chunk": results["documents"][0][i],
            })

        logger.info("向量库检索最终: %d条通过阈值", len(items))
        return items

    def delete_document(self, doc_id: str):
        """删除文档所有分块。"""
        all_ids = self._collection.get(where={"doc_id": doc_id})["ids"]
        if all_ids:
            self._collection.delete(ids=all_ids)

    def get_collection_stats(self) -> dict:
        """获取集合统计信息。"""
        count = self._collection.count()
        return {"chunk_count": count}

    def clear_all(self):
        """清空集合。"""
        self._client.delete_collection(COLLECTION_NAME)
        self._collection = self._client.create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )


# 全局单例
vector_store = VectorStore()
