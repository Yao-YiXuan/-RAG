# RAG 知识库问答系统 - 后端实现计划

> **目标:** 为现有静态前端 React 应用实现完整的 Python 后端，包含 RAG 问答、文档管理、系统设置功能，并支持 Docker 一键部署。

**架构:** FastAPI 提供 REST API，ChromaDB 作为向量数据库，LangChain 编排 RAG 流程，前端不动，在 `backend/` 目录新增后端代码。

**技术栈:** Python 3.11+ / FastAPI / LangChain / ChromaDB / SQLite / Uvicorn / Docker

***

## 全局约束

* 后端 Python 代码统一使用 `snake_case` 命名

* API 路径统一使用 `kebab-case`，如 `/api/documents/upload`

* 前端 `src/data/*.ts` 中的接口定义与后端 Pydantic 模型保持字段名一致

* 后端配置通过环境变量注入，支持 `.env` 文件

* Docker 部署: 前端 Nginx 静态服务 + 后端 Uvicorn + ChromaDB 持久化卷

***

## 当前状态分析

```
项目根目录 (现有前端 React + Vite 项目)
├── src/                    # React 组件、页面、数据 mock
│   ├── data/               # 接口定义: IChatMessage, IDocument, ISystemSettings 等
│   ├── pages/              # HomePage, DocumentsPage, SettingsPage
│   └── components/         # shadcn/ui 组件 + Layout
├── package.json
├── vite.config.ts
└── index.html
```

**关键发现:**

* 所有数据操作都是前端 mock，无真实 API 调用

* `IChatMessage` 包含 `role`(user/ai), `content`, `timestamp`

* `IDocument` 包含 `name`, `uploadTime`, `status`(processed/processing/failed), `size`, `type`

* `ISystemSettings` 包含 LLM/Embedding 配置、知识库参数、检索参数、界面偏好

* 首页 ChatSection 目前用 `setTimeout` 模拟 AI 回复

***

## 新增目录结构

```
项目根目录/
├── backend/                          # Python 后端（新增）
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI 应用入口，注册路由
│   │   ├── config.py                 # 配置加载（环境变量 + 文件）
│   │   ├── database.py               # SQLite 初始化 + 会话管理
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py               # POST /api/chat 对话
│   │   │   ├── documents.py          # GET/POST/DELETE 文档
│   │   │   ├── conversations.py      # GET 会话历史
│   │   │   └── settings.py           # GET/PUT 系统设置
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── rag_pipeline.py       # RAG 流程编排（检索 + 生成）
│   │   │   ├── document_processor.py # 文档解析、分块
│   │   │   ├── vector_store.py       # ChromaDB 初始化 + CRUD
│   │   │   └── llm_client.py         # OpenAI 兼容客户端封装
│   │   └── models/
│   │       ├── __init__.py
│   │       └── schemas.py            # Pydantic 请求/响应模型
│   ├── uploads/                      # 上传文档存储目录（gitignore）
│   ├── data/                         # SQLite 和 ChromaDB 持久化目录（gitignore）
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml                # 编排前后端 + 持久化卷
├── .dockerignore
└── nginx/
    └── default.conf                  # Nginx 配置（前端静态文件 + API 反向代理）
```

***

## 变更清单

### 后端文件（全部新增）

| 文件                                       | 职责           | 关键内容                                                                                    |
| ---------------------------------------- | ------------ | --------------------------------------------------------------------------------------- |
| `backend/requirements.txt`               | Python 依赖    | fastapi, uvicorn, langchain, chromadb, openai, pypdf, python-docx, sqlalchemy, aiofiles |
| `backend/.env.example`                   | 环境变量模板       | LLM/Embedding API 配置, ChromaDB 路径等                                                      |
| `backend/app/__init__.py`                | 包标记          | 空文件                                                                                     |
| `backend/app/main.py`                    | FastAPI 入口   | 创建 app, 注册路由, CORS 配置, 生命周期管理                                                           |
| `backend/app/config.py`                  | 配置管理         | 从环境变量读取 LLM/Embedding/数据库配置                                                             |
| `backend/app/database.py`                | SQLite 初始化   | 对话历史、文档元数据、系统设置三个表                                                                      |
| `backend/app/models/schemas.py`          | Pydantic 模型  | 所有请求/响应结构体                                                                              |
| `backend/app/api/chat.py`                | 聊天 API       | POST /api/chat - 接收问题 → RAG → 返回回答                                                      |
| `backend/app/api/conversations.py`       | 会话 API       | GET /api/conversations, GET /api/conversations/{id}/messages                            |
| `backend/app/api/documents.py`           | 文档 API       | GET /api/documents, POST /api/documents/upload, DELETE /api/documents/{id}              |
| `backend/app/api/settings.py`            | 设置 API       | GET /api/settings, PUT /api/settings                                                    |
| `backend/app/core/llm_client.py`         | LLM 客户端      | 调用 OpenAI 兼容 API 进行 chat 和 embedding                                                    |
| `backend/app/core/vector_store.py`       | 向量存储         | ChromaDB 增删查操作                                                                          |
| `backend/app/core/document_processor.py` | 文档处理         | 解析 PDF/DOCX/MD/TXT, 文本分块                                                                |
| `backend/app/core/rag_pipeline.py`       | RAG 流程       | 检索 + 上下文组装 + 生成回答                                                                       |
| `backend/Dockerfile`                     | 后端 Docker 构建 | Python 3.11-slim, 安装依赖, 启动 uvicorn                                                      |
| `nginx/default.conf`                     | Nginx 配置     | /api/ 反向代理到后端, / 服务前端静态文件                                                               |
| `docker-compose.yml`                     | Docker 编排    | 后端 + 前端 + 卷挂载                                                                           |
| `.dockerignore`                          | Docker 忽略    | node\_modules, .env, uploads, data                                                      |

### 前端文件（修改）

| 文件                                                           | 修改内容                                    |
| ------------------------------------------------------------ | --------------------------------------- |
| `src/pages/HomePage/HomePage.tsx`                            | 将 `setNewMessage` 改为调用后端 `/api/chat` 接口 |
| `src/pages/HomePage/sections/ChatSection.tsx`                | 移除 mock 逻辑，改为从 API 获取 AI 回复             |
| `src/pages/HomePage/sections/ChatInputSection.tsx`           | 发送消息后调用 API                             |
| `src/pages/DocumentsPage/DocumentsPage.tsx`                  | 替换 mock 数据操作为 API 调用                    |
| `src/pages/DocumentsPage/sections/DocumentUploadSection.tsx` | 上传调用 POST /api/documents/upload         |
| `src/pages/DocumentsPage/sections/DocumentListSection.tsx`   | 列表和删除调用 API                             |
| `src/pages/SettingsPage/SettingsPage.tsx`                    | 加载和保存调用 API                             |
| `src/data/chat-message.ts`                                   | 可能需要调整 `status` 字段                      |
| `src/data/document.ts`                                       | 无需修改接口定义                                |
| `src/data/system-settings.ts`                                | 无需修改接口定义                                |

***

## API 设计

### 1. 聊天 API

```
POST /api/chat
Request:  { "message": string, "conversation_id"?: string }
Response: {
  "reply": string,
  "conversation_id": string,
  "sources": [{ "document_name": string, "score": float, "chunk": string }]
}
```

* 如果 `conversation_id` 为空，新建会话

* RAG 流程: 向量检索 → 构建 prompt → 调用 LLM → 返回回答 + 来源

* 消息和回复自动存入 SQLite

### 2. 会话历史 API

```
GET /api/conversations
Response: [{ "id": string, "title": string, "created_at": string, "message_count": int }]

GET /api/conversations/{id}/messages
Response: [{ "id": string, "role": "user"|"assistant", "content": string, "timestamp": string }]
```

### 3. 文档管理 API

```
GET /api/documents?keyword=&status=
Response: [{ "id": string, "name": string, "upload_time": string, "status": string, "size": string, "type": string }]

POST /api/documents/upload
Request:  multipart/form-data { file: File }
Response: { "id": string, "name": string, "status": "processing" }

DELETE /api/documents/{id}
Response: { "success": true }
```

* 上传后异步处理: 保存文件 → 解析内容 → 分块 → 向量化 → 存入 ChromaDB → 更新状态

### 4. 系统设置 API

```
GET /api/settings
Response: { "llm_api_key": string, "llm_base_url": string, ..., "similarity_threshold": float }

PUT /api/settings
Request:  { "llm_api_key": string, ..., "similarity_threshold": float }
Response: { "success": true }
```

* 设置存入 SQLite，API Key 在数据库中做加密存储（简易 base64）

***

## 数据流

### 文档上传流程

```
前端选择文件 → POST /api/documents/upload → 后端保存文件到 uploads/
  → 返回 { status: "processing" }
  → 异步: document_processor.parse(file) → 文本分块
  → 异步: llm_client.embed(chunks) → vector_store.add(embeddings + metadata)
  → 异步: SQLite 更新文档 status = "processed"
```

### 问答流程

```
用户输入问题 → POST /api/chat → 后端:
  1. llm_client.embed(question) → question_embedding
  2. vector_store.search(question_embedding, top_k, threshold) → relevant_chunks
  3. 构建 prompt: {context} + {question}
  4. llm_client.chat(prompt) → answer
  5. SQLite 保存 {user_message, assistant_message, sources}
  6. 返回 { reply, conversation_id, sources }
```

***

## 任务拆分

### Task 1: 创建后端项目骨架

**文件:**

* Create: `backend/requirements.txt`

* Create: `backend/.env.example`

* Create: `backend/app/__init__.py`

* Create: `backend/app/main.py`

* Create: `backend/app/config.py`

* Create: `backend/app/database.py`

* Create: `backend/app/models/__init__.py`

* Create: `backend/app/models/schemas.py`

**步骤:**

1. **创建** **`requirements.txt`**

```
fastapi==0.115.0
uvicorn[standard]==0.30.0
langchain==0.3.0
langchain-community==0.3.0
chromadb==0.5.0
openai==1.45.0
pypdf==5.0.0
python-docx==1.1.2
python-multipart==0.0.12
sqlalchemy==2.0.35
aiofiles==24.1.0
pydantic-settings==2.5.0
python-dotenv==1.0.1
```

1. **创建** **`.env.example`**

```bash
# LLM 配置
LLM_API_KEY=sk-your-api-key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_NAME=gpt-4o-mini

# Embedding 配置
EMBEDDING_API_KEY=sk-your-api-key
EMBEDDING_BASE_URL=https://api.openai.com/v1
EMBEDDING_MODEL_NAME=text-embedding-3-small

# 数据库路径
SQLITE_PATH=./data/rag.db
CHROMA_DB_PATH=./data/chroma_db
UPLOAD_DIR=./uploads

# 服务器配置
HOST=0.0.0.0
PORT=8000
```

1. **创建** **`app/config.py`**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    llm_api_key: str = ""
    llm_base_url: str = "https://api.openai.com/v1"
    llm_model_name: str = "gpt-4o-mini"
    embedding_api_key: str = ""
    embedding_base_url: str = "https://api.openai.com/v1"
    embedding_model_name: str = "text-embedding-3-small"
    sqlite_path: str = "./data/rag.db"
    chroma_db_path: str = "./data/chroma_db"
    upload_dir: str = "./uploads"
    host: str = "0.0.0.0"
    port: int = 8000

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

settings = Settings()
```

1. **创建** **`app/database.py`** - SQLAlchemy 模型 + 初始化

* 三个表: `Conversation`, `Message`, `Document`, `SystemSetting`

* Conversation: id, title, created\_at, updated\_at

* Message: id, conversation\_id, role, content, timestamp

* Document: id, name, upload\_time, status, size, type

* SystemSetting: id, key, value

1. **创建** **`app/main.py`** - FastAPI 入口 + CORS + 路由注册

2. **创建** **`app/models/schemas.py`** - 所有 Pydantic 请求/响应模型

**验证:** `cd backend && pip install -r requirements.txt && python -c "from app.main import app; print('OK')"`

***

### Task 2: 实现 LLM 客户端

**文件:**

* Create: `backend/app/core/__init__.py`

* Create: `backend/app/core/llm_client.py`

**步骤:**

1. **创建** **`llm_client.py`** - 封装 OpenAI 兼容 API 调用

* `class LLMClient`:

  * `__init__`: 从 settings 或动态传入配置

  * `chat(messages: list, model: str = None)` → str: 调用 chat/completions

  * `embed(texts: list[str])` → list\[list\[float]]: 调用 embeddings

* 支持动态更新配置（设置页修改后无需重启服务）

* 错误处理: API 调用失败时抛出明确异常

**验证:** `python -c "from app.core.llm_client import LLMClient; client = LLMClient(); print('OK')"`

***

### Task 3: 实现向量存储

**文件:**

* Create: `backend/app/core/vector_store.py`

**步骤:**

1. **创建** **`vector_store.py`** - ChromaDB 封装

* `class VectorStore`:

  * `__init__`: 初始化 ChromaDB 客户端，创建/获取 collection

  * `add_document(chunks: list[str], metadatas: list[dict], embeddings: list[list[float]], doc_id: str)` → None

  * `search(query_embedding: list[float], top_k: int = 5, threshold: float = 0.7)` → list\[dict]: 返回 chunks + scores + metadata

  * `delete_document(doc_id: str)` → None

  * `get_collection_stats()` → dict: 文档数量、块数量

**验证:** `python -c "from app.core.vector_store import VectorStore; vs = VectorStore(); print('OK')"`

***

### Task 4: 实现文档处理器

**文件:**

* Create: `backend/app/core/document_processor.py`

**步骤:**

1. **创建** **`document_processor.py`**

* `parse_file(file_path: str, file_type: str)` → str: 解析 PDF/DOCX/MD/TXT 为纯文本

  * PDF: pypdf

  * DOCX: python-docx

  * MD/TXT: 直接读取

* `chunk_text(text: str, strategy: str = "semantic", chunk_size: int = 512)` → list\[str]:

  * 支持 `fixed`（固定字符数）、`semantic`（按段落/标题）、`recursive`（递归分隔符）三种策略

* `process_document(file_path: str, doc_id: str, settings: dict)` → None:

  * 解析 → 分块 → 嵌入 → 存入向量库 → 更新文档状态

**验证:** `python -c "from app.core.document_processor import parse_file, chunk_text; print('OK')"`

***

### Task 5: 实现 RAG Pipeline

**文件:**

* Create: `backend/app/core/rag_pipeline.py`

**步骤:**

1. **创建** **`rag_pipeline.py`**

* `class RAGPipeline`:

  * `__init__(llm_client, vector_store)`: 注入依赖

  * `query(question: str, top_k: int = 5, threshold: float = 0.7)` → dict:

    1. 对问题做 embedding
    2. 从 vector\_store 搜索相关 chunks
    3. 组装 prompt: `基于以下上下文回答问题:\n\n{context}\n\n问题: {question}`
    4. 调用 llm\_client.chat()
    5. 返回 `{ "reply": str, "sources": [...] }`

**验证:** `python -c "from app.core.rag_pipeline import RAGPipeline; print('OK')"`

***

### Task 6: 实现 API 路由

**文件:**

* Create: `backend/app/api/__init__.py`

* Create: `backend/app/api/chat.py`

* Create: `backend/app/api/conversations.py`

* Create: `backend/app/api/documents.py`

* Create: `backend/app/api/settings.py`

**步骤:**

1. **chat.py** - `router = APIRouter(prefix="/api/chat")`

   * `POST /` → 接收消息 → RAGPipeline.query() → 保存对话 → 返回回复

2. **conversations.py** - `router = APIRouter(prefix="/api/conversations")`

   * `GET /` → 返回所有会话列表

   * `GET /{id}/messages` → 返回指定会话的消息列表

3. **documents.py** - `router = APIRouter(prefix="/api/documents")`

   * `GET /` → 支持 keyword + status 查询参数 → 返回文档列表

   * `POST /upload` → 接收文件 → 保存 → 异步处理 → 返回文档信息

   * `DELETE /{id}` → 删除文件 + 向量库数据 + 数据库记录

4. **settings.py** - `router = APIRouter(prefix="/api/settings")`

   * `GET /` → 返回当前设置

   * `PUT /` → 更新设置（同步更新 LLMClient 等运行时实例）

**验证:** `cd backend && python -m uvicorn app.main:app --reload`，用 curl 测试各端点

***

### Task 7: 修改前端连接后端 API

**文件:**

* Modify: `src/pages/HomePage/HomePage.tsx`

* Modify: `src/pages/HomePage/sections/ChatSection.tsx`

* Modify: `src/pages/HomePage/sections/ChatInputSection.tsx`

* Modify: `src/pages/DocumentsPage/DocumentsPage.tsx`

* Modify: `src/pages/DocumentsPage/sections/DocumentUploadSection.tsx`

* Modify: `src/pages/DocumentsPage/sections/DocumentListSection.tsx`

* Modify: `src/pages/SettingsPage/SettingsPage.tsx`

**步骤:**

1. **创建 API 工具** - `src/lib/api.ts`

   ```typescript
   const API_BASE = '/api';

   export const api = {
     chat: {
       send: (message: string, conversationId?: string) =>
         fetch(`${API_BASE}/chat`, { method: 'POST', body: JSON.stringify({ message, conversation_id: conversationId }) }),
       getConversations: () => fetch(`${API_BASE}/conversations`),
       getMessages: (id: string) => fetch(`${API_BASE}/conversations/${id}/messages`),
     },
     documents: {
       list: (keyword?: string, status?: string) => fetch(`${API_BASE}/documents?keyword=${keyword}&status=${status}`),
       upload: (file: File) => { const fd = new FormData(); fd.append('file', file); return fetch(`${API_BASE}/documents/upload`, { method: 'POST', body: fd }); },
       delete: (id: string) => fetch(`${API_BASE}/documents/${id}`, { method: 'DELETE' }),
     },
     settings: {
       get: () => fetch(`${API_BASE}/settings`),
       save: (settings: any) => fetch(`${API_BASE}/settings`, { method: 'PUT', body: JSON.stringify(settings) }),
     },
   };
   ```

2. **修改 HomePage** - 发送请求到 `/api/chat`，获取真实回复

3. **修改 DocumentsPage** - 替换 mock 数据为 API 调用

4. **修改 SettingsPage** - 从 `/api/settings` 加载/保存设置

**验证:** `npm run dev`，前端能够与后端正常交互

***

### Task 8: Docker 部署配置

**文件:**

* Create: `backend/Dockerfile`

* Create: `nginx/default.conf`

* Create: `docker-compose.yml`

* Create: `.dockerignore`

**步骤:**

1. **backend/Dockerfile** - 多阶段构建

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

1. **nginx/default.conf** - 反向代理

```nginx
server {
    listen 80;
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
    }
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

1. **docker-compose.yml**

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - backend-data:/app/data
      - backend-uploads:/app/uploads
    env_file: ./backend/.env

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  backend-data:
  backend-uploads:
```

1. **前端 Dockerfile** - 在项目根目录

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
```

**验证:** `docker-compose up --build`，访问 `http://localhost` 看到前端页面，API 正常响应

***

## 假设与决策

| 决策     | 选择                  | 理由                    |
| ------ | ------------------- | --------------------- |
| 后端语言   | Python 3.11+        | RAG/LangChain 生态最成熟   |
| API 框架 | FastAPI             | 异步支持好，自动生成 OpenAPI 文档 |
| 向量数据库  | ChromaDB            | 轻量级本地部署，无需额外服务        |
| LLM 调用 | OpenAI 兼容 API       | 通过设置页可配置任意兼容服务商       |
| 文档存储   | 本地文件系统              | 简单直接，Docker 卷持久化      |
| 元数据存储  | SQLite              | 零配置，嵌入式中型关系库          |
| 文档解析   | pypdf + python-docx | 覆盖 PDF/DOCX 主流格式      |
| 部署方式   | Docker Compose      | 一键部署，前后端 + 数据卷统一编排    |
| 会话管理   | 后端管理 + 前端展示         | 无用户系统，单用户模式           |

## 验证步骤

1. 后端启动后访问 `http://localhost:8000/docs` 可看到 Swagger 文档
2. 上传 PDF/DOCX/MD 文档 → 文档列表显示"处理中"→ 2-3秒后变为"已处理"
3. 在首页输入问题 → 收到基于知识库的 AI 回复，并附带来源文档
4. 修改系统设置 → 保存 → 刷新后设置保持
5. `docker-compose up --build` 一键启动，浏览器访问 `http://localhost` 完整可用
6. 配置 GitHub Actions (可选): `.github/workflows/deploy.yml`

