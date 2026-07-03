import os
import re
import logging
import threading
from typing import Callable

from app.core.llm_client import llm_client
from app.core.vector_store import vector_store
from app.database import SessionLocal, Document

logger = logging.getLogger(__name__)


def parse_file(file_path: str, file_type: str) -> str:
    """解析文档为纯文本。"""
    file_type = file_type.upper()
    if file_type == "PDF":
        from pypdf import PdfReader
        reader = PdfReader(file_path)
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    elif file_type == "DOCX":
        from docx import Document as DocxDocument
        doc = DocxDocument(file_path)
        return "\n".join(p.text for p in doc.paragraphs)
    else:
        # MD / TXT / 其他纯文本格式
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            return f.read()


def chunk_text(
    text: str,
    strategy: str = "semantic",
    chunk_size: int = 512,
) -> list[str]:
    """按策略对文本分块。"""
    text = text.strip()
    if not text:
        return []

    if strategy == "fixed":
        return _fixed_chunk(text, chunk_size)
    elif strategy == "recursive":
        return _recursive_chunk(text, chunk_size)
    else:
        # semantic: 按段落/标题分块
        return _semantic_chunk(text, chunk_size)


def _fixed_chunk(text: str, chunk_size: int) -> list[str]:
    """固定字符数分块（重叠 64 字符）。"""
    overlap = min(64, chunk_size // 4)
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end].strip())
        start += chunk_size - overlap
    return [c for c in chunks if c]


def _semantic_chunk(text: str, chunk_size: int) -> list[str]:
    """按段落/标题分块，合并小段落到接近 chunk_size。"""
    # 先按双换行或标题分割
    paragraphs = re.split(r"\n\s*\n|(?=^#{1,3}\s)", text, flags=re.MULTILINE)
    paragraphs = [p.strip() for p in paragraphs if p.strip()]

    chunks = []
    current = []
    current_len = 0
    for para in paragraphs:
        if current_len + len(para) <= chunk_size:
            current.append(para)
            current_len += len(para)
        else:
            if current:
                chunks.append("\n\n".join(current))
            # 单段落超过 chunk_size 则截断
            if len(para) > chunk_size:
                for c in _fixed_chunk(para, chunk_size):
                    chunks.append(c)
                current = []
                current_len = 0
            else:
                current = [para]
                current_len = len(para)
    if current:
        chunks.append("\n\n".join(current))
    return chunks


def _recursive_chunk(text: str, chunk_size: int) -> list[str]:
    """递归分隔符分块。"""
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=64,
        separators=["\n\n", "\n", "。", ".", " ", ""],
    )
    return splitter.split_text(text)


def _process_document_sync(doc_id: str, file_path: str, file_type: str, file_name: str,
                           strategy: str, chunk_size: int):
    """同步处理文档（在后台线程运行）。"""
    db = SessionLocal()
    try:
        logger.info("开始处理文档: %s (类型=%s, 策略=%s, 块大小=%d)", file_name, file_type, strategy, chunk_size)

        # 解析
        text = parse_file(file_path, file_type)
        if not text.strip():
            logger.warning("文档解析结果为空: %s", file_name)
            _update_doc_status(db, doc_id, "failed")
            return
        logger.info("文档解析完成: %s, 文本长度=%d", file_name, len(text))

        # 分块
        chunks = chunk_text(text, strategy, chunk_size)
        if not chunks:
            logger.warning("分块结果为空: %s", file_name)
            _update_doc_status(db, doc_id, "failed")
            return
        logger.info("分块完成: %s, 分块数=%d", file_name, len(chunks))

        # 嵌入
        logger.info("开始生成向量嵌入: %s, 共%d个块", file_name, len(chunks))
        embeddings = llm_client.embed(chunks)
        logger.info("向量嵌入完成: %s, 向量维度=%d", file_name, len(embeddings[0]) if embeddings else 0)

        # 存入向量库
        metadatas = [{"name": file_name, "doc_id": doc_id} for _ in chunks]
        vector_store.add_document(doc_id, chunks, embeddings, metadatas)
        logger.info("向量库写入完成: %s, 共%d条", file_name, len(chunks))

        # 更新状态
        _update_doc_status(db, doc_id, "processed")
        logger.info("文档处理成功: %s", file_name)
    except Exception as e:
        logger.error("文档处理失败: %s, 错误: %s", file_name, str(e), exc_info=True)
        _update_doc_status(db, doc_id, "failed")
    finally:
        db.close()


def _update_doc_status(db: SessionLocal, doc_id: str, status: str):
    """更新文档处理状态。"""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if doc:
        doc.status = status
        db.commit()


def process_document_async(doc_id: str, file_path: str, file_type: str,
                           file_name: str,
                           strategy: str = "semantic",
                           chunk_size: int = 512):
    """异步启动文档处理。"""
    thread = threading.Thread(
        target=_process_document_sync,
        args=(doc_id, file_path, file_type, file_name, strategy, chunk_size),
        daemon=True,
    )
    thread.start()
