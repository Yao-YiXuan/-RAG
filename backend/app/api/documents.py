import os
import uuid

from fastapi import APIRouter, Depends, UploadFile, File, Query, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db, Document
from app.models.schemas import DocumentItem, DocumentUploadResponse, DocumentContentResponse, DeleteResponse
from app.config import settings
from app.core.document_processor import process_document_async, parse_file
from app.core.vector_store import vector_store

router = APIRouter(prefix="/api/documents", tags=["文档"])

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".md", ".txt", ".csv"}


@router.get("", response_model=list[DocumentItem])
def list_documents(
    keyword: str = Query("", description="按名称搜索"),
    status: str = Query("all", description="状态筛选：all/processed/processing/failed"),
    db: Session = Depends(get_db),
):
    """获取文档列表。"""
    query = db.query(Document).order_by(Document.upload_time.desc())
    if keyword:
        query = query.filter(Document.name.ilike(f"%{keyword}%"))
    if status != "all":
        query = query.filter(Document.status == status)

    rows = query.all()
    return [
        DocumentItem(
            id=r.id,
            name=r.name,
            upload_time=r.upload_time.strftime("%Y-%m-%d %H:%M"),
            status=r.status,
            size=r.size,
            type=r.type,
        )
        for r in rows
    ]


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """上传文档。"""
    # 验证文件类型
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"不支持的文件类型: {ext}，支持: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # 创建文档记录
    doc_id = uuid.uuid4().hex
    file_type = ext.lstrip(".").upper()
    if file_type == "DOC":
        file_type = "DOCX"

    doc = Document(
        id=doc_id,
        name=file.filename or "未命名文件",
        status="processing",
        size="0 MB",
        type=file_type,
    )
    db.add(doc)
    db.commit()

    # 保存文件
    os.makedirs(settings.upload_dir, exist_ok=True)
    file_path = os.path.join(settings.upload_dir, f"{doc_id}{ext}")
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # 更新文件大小
    size_bytes = len(content)
    if size_bytes < 1024 * 1024:
        size_str = f"{size_bytes / 1024:.1f} KB"
    else:
        size_str = f"{size_bytes / (1024 * 1024):.1f} MB"
    doc.size = size_str
    doc.file_path = file_path
    db.commit()

    # 读取分块设置
    from app.database import SystemSetting
    strategy = "semantic"
    chunk_size = 512
    for row in db.query(SystemSetting).all():
        if row.key == "chunk_strategy":
            strategy = row.value or strategy
        if row.key == "chunk_size":
            chunk_size = int(row.value) if row.value else chunk_size

    # 异步处理文档
    process_document_async(
        doc_id=doc_id,
        file_path=file_path,
        file_type=file_type,
        file_name=doc.name,
        strategy=strategy,
        chunk_size=chunk_size,
    )

    return DocumentUploadResponse(id=doc_id, name=doc.name)


@router.get("/{document_id}/content", response_model=DocumentContentResponse)
def get_document_content(document_id: str, db: Session = Depends(get_db)):
    """获取文档内容。"""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文档不存在")

    if not doc.file_path or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="文档文件不存在")

    try:
        content = parse_file(doc.file_path, doc.type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"读取文档失败: {str(e)}")

    return DocumentContentResponse(
        id=doc.id,
        name=doc.name,
        content=content,
        type=doc.type,
    )


@router.delete("/{document_id}", response_model=DeleteResponse)
def delete_document(document_id: str, db: Session = Depends(get_db)):
    """删除文档。"""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="文档不存在")

    # 删除文件
    if doc.file_path and os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    # 删除向量库数据
    try:
        vector_store.delete_document(document_id)
    except Exception:
        pass

    # 删除数据库记录
    db.delete(doc)
    db.commit()

    return DeleteResponse(success=True)
