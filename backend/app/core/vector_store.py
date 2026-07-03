import os
import chromadb
from chromadb.config import Settings as ChromaSettings

from app.config import settings


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
        threshold: float = 0.7,
    ) -> list[dict]:
        """检索最相似的分块。"""
        results = self._collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
        )
        items = []
        if not results["ids"]:
            return items
        for i in range(len(results["ids"][0])):
            score = 1 - (results["distances"][0][i] if results["distances"] else 0)
            if score < threshold:
                continue
            items.append({
                "document_name": (results["metadatas"][0][i] or {}).get("name", ""),
                "score": round(score, 4),
                "chunk": results["documents"][0][i],
            })
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
