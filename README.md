# RAG 知识库问答系统

基于 **RAG（Retrieval-Augmented Generation）** 技术的智能文档问答系统。上传你的文档（PDF、DOCX、Markdown、TXT 等），AI 将基于知识库内容为你提供精准、可溯源的回答。

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-61DAFB)
![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688)
![Database](https://img.shields.io/badge/Vector%20DB-ChromaDB-FF6F00)
![LLM](https://img.shields.io/badge/LLM-Ollama%20%7C%20OpenAI%20API-007AFF)

---

## 功能特性

- **智能问答**：基于 RAG 的对话式问答，回复附带来源引用
- **多格式文档支持**：上传 PDF、DOCX、Markdown、TXT、CSV 等文件
- **多种分块策略**：固定大小分块、语义分块、递归分块
- **向量检索**：使用 ChromaDB 进行语义相似度检索，支持调节检索数量和相似度阈值
- **本地模型**：通过 Ollama 接入本地大语言模型和 Embedding 模型，数据不出本机
- **对话历史**：聊天记录持久化存储，离开页面后仍可恢复
- **主题切换**：深色/浅色主题自由切换
- **国际化**：简体中文 / English 双语界面
- **Docker 部署**：一键部署，支持 docker-compose

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| UI 组件 | shadcn/ui + Tailwind CSS 4 |
| 动效 | Framer Motion |
| 后端框架 | FastAPI (Python) |
| 数据库 | SQLite (SQLAlchemy) |
| 向量数据库 | ChromaDB |
| LLM / Embedding | Ollama（OpenAI 兼容 API） |
| 部署 | Docker + Docker Compose |

## 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) >= 20.19
- [Python](https://www.python.org/) >= 3.11
- [Ollama](https://ollama.com/)（可选，用于本地模型）
- [Docker](https://www.docker.com/)（可选，用于容器化部署）

### 本地开发

#### 1. 安装 Ollama 模型（可选）

```bash
# LLM 模型
ollama pull qwen2.5:7b

# Embedding 模型
ollama pull bge-m3
```

#### 2. 配置后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 编辑配置（根据需要修改 .env 中的模型和 API 地址）
```

`.env` 主要配置项：

```env
LLM_API_KEY=ollama
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL_NAME=qwen2.5:7b

EMBEDDING_API_KEY=ollama
EMBEDDING_BASE_URL=http://localhost:11434/v1
EMBEDDING_MODEL_NAME=bge-m3
```

#### 3. 启动后端

```bash
# 在 backend 目录下
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 4. 启动前端

```bash
# 在项目根目录下
npm install
npm run dev
```

前端默认运行在 `http://localhost:8001`，API 请求自动代理到后端 `http://localhost:8000`。

### Docker 部署

```bash
# 在项目根目录下
docker-compose up -d --build
```

- 前端：`http://localhost:80`
- 后端 API：`http://localhost:8000`

## 项目结构

```
├── src/                          # 前端代码
│   ├── components/               # 通用组件
│   │   └── ui/                   # shadcn/ui 基础组件
│   ├── lib/                      # 工具库
│   │   ├── api.ts                # API 客户端
│   │   └── i18n.ts               # 国际化
│   ├── pages/                    # 页面
│   │   ├── HomePage/             # 首页（问答）
│   │   ├── DocumentsPage/        # 文档管理
│   │   ├── SettingsPage/         # 系统设置
│   │   └── NotFoundPage/         # 404
│   └── tailwind-theme.css        # 主题变量
│
├── backend/                      # 后端代码
│   ├── app/
│   │   ├── api/                  # API 路由
│   │   │   ├── chat.py           # 聊天接口
│   │   │   ├── documents.py      # 文档管理接口
│   │   │   ├── conversations.py  # 会话管理接口
│   │   │   └── settings.py       # 系统设置接口
│   │   ├── core/                 # 核心逻辑
│   │   │   ├── llm_client.py     # LLM / Embedding 客户端
│   │   │   ├── vector_store.py   # ChromaDB 向量存储
│   │   │   ├── document_processor.py  # 文档解析与分块
│   │   │   └── rag_pipeline.py   # RAG 流水线
│   │   ├── models/
│   │   │   └── schemas.py        # Pydantic 数据模型
│   │   ├── config.py             # 配置管理
│   │   ├── database.py           # SQLite 数据模型
│   │   └── main.py               # FastAPI 入口
│   └── .env                      # 环境变量
│
├── docker-compose.yml            # Docker 编排
└── README.md
```

## 系统设置

在系统设置页面可配置：

| 分组 | 配置项 | 说明 |
|------|--------|------|
| 模型配置 | LLM / Embedding | API Key、Base URL、模型名称 |
| 知识库设置 | 名称 / 描述 | 知识库基本信息 |
| 知识库设置 | 分块策略 | 固定大小 / 语义分块 / 递归分块 |
| 知识库设置 | 分块大小 | 每个文档块的最大字符数 |
| 检索设置 | 检索数量 | 每次检索返回的相关片段数（1-20） |
| 检索设置 | 相似度阈值 | 仅返回相似度高于此值的结果（0-1） |
| 界面设置 | 主题 | 深色 / 浅色 |
| 界面设置 | 语言 | 简体中文 / English |

## RAG 工作原理

```
用户提问
    │
    ▼
┌─────────────────────┐
│  1. 问题向量化       │  ← Embedding 模型
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  2. 向量库检索       │  ← ChromaDB 语义搜索
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  3. 构建上下文       │  ← 拼接检索到的文档片段
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  4. LLM 生成回答     │  ← 大语言模型
└─────────┬───────────┘
          │
          ▼
      回复 + 来源引用
```

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/chat` | 发送消息进行 RAG 问答 |
| GET | `/api/conversations` | 获取会话列表 |
| GET | `/api/conversations/{id}/messages` | 获取会话消息 |
| GET | `/api/documents` | 获取文档列表 |
| POST | `/api/documents/upload` | 上传文档 |
| GET | `/api/documents/{id}/content` | 获取文档内容 |
| DELETE | `/api/documents/{id}` | 删除文档 |
| GET | `/api/settings` | 获取系统设置 |
| PUT | `/api/settings` | 保存系统设置 |
| POST | `/api/settings/test-llm` | 测试 LLM 连接 |
| POST | `/api/settings/test-embedding` | 测试 Embedding 连接 |
| GET | `/api/health` | 健康检查 |

## 开源协议

MIT
