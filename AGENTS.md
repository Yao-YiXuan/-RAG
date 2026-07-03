# RAG知识问答系统 - 需求拆解文档

## 产品概述

- **产品类型**: Web应用（知识管理工具）
- **场景类型**: <scene_type>prototype-app</scene_type>
- **目标用户**: 个人用户，需要基于私有知识库进行智能问答
- **核心价值**: 提供基于RAG技术的知识库管理与智能问答界面，帮助用户高效检索和管理私有文档知识
- **界面语言**: 中文
- **主题偏好**: 深色（冷色科技风，蓝青色点缀）
- **导航模式**: 路径导航
- **导航布局**: Sidebar（左侧侧边栏导航）

---

## 页面结构总览

| 页面名称 | 文件名 | 路由 | 页面类型 | 入口来源 |
|---------|-------|------|---------|---------|
| 首页（问答） | `HomePage.tsx` | `/` | 一级 | 导航 |
| 文档管理 | `DocumentsPage.tsx` | `/documents` | 一级 | 导航 |
| 系统设置 | `SettingsPage.tsx` | `/settings` | 一级 | 导航 |

---

## 页面布局建议

- **布局模式**: 左侧固定侧边栏 + 右侧主内容区（经典后台布局），侧边栏宽度约240px，主内容区自适应填充
- **视觉重心**: 首页以对话流为核心视觉重心，文档管理以文档列表表格为核心，设置页以表单控件为核心
- **结果承载区**: 
  - 首页：对话消息列表区域，初始态展示欢迎语和示例问题快捷入口
  - 文档管理：文档列表表格，初始态展示mock文档数据
  - 系统设置：各设置分组表单，初始态展示默认配置值

---

## 导航配置

- **导航布局**: Sidebar（左侧固定，深色背景，带蓝青色高亮当前项）
- **导航项**（仅一级页面）:

| 导航文字 | 路由 | 图标(可选) |
|---------|------|-----------|
| 首页/问答 | `/` | MessageSquare / Home |
| 文档管理 | `/documents` | FileText / Folder |
| 系统设置 | `/settings` | Settings |

---

## 数据来源声明

| 数据/操作 | 来源类型 | 实现要求 | mock 兜底 |
|---|---|---|---|
| 对话消息列表 | demo-mock | 使用本地state管理消息数组，初始含欢迎消息 | ✅ 本身就是mock，含3条示例对话 |
| 示例问题列表 | demo-mock | 静态数组，点击后自动填充到输入框或直接发送 | ✅ 本身就是mock，含4-5个示例问题 |
| 文档列表数据 | demo-mock | 静态mock数组，含文档名、上传时间、状态、大小等字段 | ✅ 本身就是mock，含5-8条示例文档 |
| 文档搜索筛选 | demo-mock | 前端本地过滤mock数据，按名称/状态筛选 | ✅ 本身就是mock |
| 文档上传操作 | demo-mock | 模拟上传，点击后往mock列表追加一条新记录 | ✅ 本身就是mock，toast提示"上传成功" |
| 文档删除操作 | demo-mock | 从mock列表中移除对应项 | ✅ 本身就是mock，toast提示"删除成功" |
| 系统设置配置项 | demo-mock | 使用本地state管理各配置项，初始有默认值 | ✅ 本身就是mock，含LLM模型/Embedding模型/知识库名称等默认值 |
| 设置保存操作 | demo-mock | 点击保存后更新本地state，toast提示保存成功 | ✅ 本身就是mock |

---

## 功能列表

- **页面**: 首页（问答）
  - **页面目标**: 提供RAG知识问答的核心交互界面，用户输入问题后查看AI回复
  - **功能点**:
    - **欢迎引导**: 首次进入展示系统标题、欢迎语和副标题说明，引导用户开始提问
    - **对话消息流**: 展示历史对话消息列表，用户消息靠右（蓝青色气泡），AI回复靠左（深色半透明气泡），支持自动滚动到最新消息
    - **问题输入与发送**: 底部固定输入框区域，支持文本输入和Enter键发送，发送后清空输入框并在对话流中追加用户消息
    - **示例问题快捷入口**: 在欢迎区域或输入框上方展示4-5个示例问题卡片，点击后自动发送该问题
    - **消息状态指示**: AI回复前展示"思考中..."加载动画（打字机效果或闪烁光标），模拟RAG检索和生成过程

- **页面**: 文档管理
  - **页面目标**: 管理知识库文档，查看文档处理状态，支持上传和删除操作
  - **功能点**:
    - **文档列表表格**: 以表格形式展示已上传文档，列包含：文档名称、上传时间、处理状态（已处理/处理中/失败，带颜色Badge）、文件大小、操作按钮
    - **搜索与筛选**: 顶部搜索框支持按文档名称关键词过滤，状态筛选下拉框（全部/已处理/处理中/失败）
    - **上传新文档**: 顶部"上传文档"按钮，点击触发文件选择（模拟），上传后列表新增一条"处理中"状态的文档，2秒后自动变为"已处理"
    - **文档操作**: 每条文档行末尾有操作按钮组（查看详情、删除），删除时弹出确认提示，确认后从列表移除
    - **空状态提示**: 当文档列表为空时，展示空状态插图和引导文案"暂无文档，点击上方按钮上传"

- **页面**: 系统设置
  - **页面目标**: 配置RAG系统的各项参数，包括模型选择、知识库设置、检索参数和界面偏好
  - **功能点**:
    - **模型配置区**: 卡片式分组，包含LLM模型下拉选择（GPT-4/Claude-3/DeepSeek等mock选项）和Embedding模型下拉选择（text-embedding-3/bge-large等mock选项）
    - **知识库设置区**: 卡片式分组，包含知识库名称文本输入、知识库描述多行文本输入、分块策略下拉选择（固定大小/语义分块/递归分块）及分块大小数字输入
    - **检索设置区**: 卡片式分组，包含检索数量滑块（1-20）、相似度阈值滑块（0-1，步长0.01），实时显示当前数值
    - **界面设置区**: 卡片式分组，包含主题切换开关（深色/浅色，当前默认深色）、语言选择等
    - **保存与重置**: 底部固定操作栏，包含"保存设置"按钮（点击后toast提示"设置已保存"）和"恢复默认"按钮（点击后重置所有配置项为默认值）

---

## 数据共享配置

本需求为纯静态mock展示，各页面数据独立管理，无需跨页面数据共享。

-------

<scene_type>prototype-app</scene_type>

# UI 设计指南

## 1. 设计推导依据

- **参考意图**: Free Direction —— 无参考材料，从产品语义与用户情绪出发自主建立视觉方向
- **核心情绪 / 应用类型**: RAG 知识问答系统，个人知识库工具 —— 冷静、信任、精准、沉浸式检索体验
- **独特记忆点**: 毛玻璃侧边栏叠加深空底色，对话气泡以冷蓝微光边界区分人机，文档卡片悬浮时透出青蓝扫描线暗示"正在理解你的知识"

## 2. Art Direction

- **方向名**: Frosted Terminal
- **Design Style**: Frosted Glass 毛玻璃 + Minimal Dark 极简深色 —— 毛玻璃赋予侧边栏和卡片科技感与层次，深色底让蓝青色点缀更锐利，适合 AI 知识工作场景的专注沉浸
- **DNA 参数**: 圆角 subtle（`rounded-lg`/`rounded-xl`）/ 阴影 layered（`shadow-lg` + blur 层）/ 间距 spacious（`gap-6`/`p-6`）/ 字体方向 无衬线几何感 / 装饰手法 毛玻璃 blur 叠加细边框 + 青蓝微光渐变
- **应用类型**: Tool —— 左侧固定导航 + 右侧内容区，三页切换

## 3. Color System

**色彩关系**: 深空蓝黑基底 + 冷蓝灰卡片承载面 + 青蓝 primary 作为主交互与品牌锚点 + 极浅蓝灰 accent 反馈底
**配色设计理由**: primary 青蓝用于主按钮、激活态、链接和关键状态标识，在深色背景上形成清晰视觉锚点但不刺眼；bg 深空色降低长时间阅读疲劳；accent 浅蓝灰用于 hover/focus 反馈和选中态，保持冷色一致性；text 高亮白确保可读性
**主色推导**: 用户指定"冷色科技风，蓝青色点缀"—— primary 取青蓝（色相 190-200），在深色底上呈现冷峻科技感，饱和度控制在 70-80% 避免霓虹感
**使用比例**: 60% 深色中性底 / 30% 冷蓝灰辅助 / 10% 青蓝 primary

| 角色 | CSS 变量 | Tailwind Class | HSL 值 | 设计说明 |
|---|---|---|---|---|
| bg | `--background` | `bg-background` | hsl(210 30% 6%) | 深空蓝黑页面底，沉浸感 |
| card | `--card` | `bg-card` | hsl(210 25% 10%) | 卡片、对话气泡、设置面板，比 bg 稍亮 |
| text | `--foreground` | `text-foreground` | hsl(210 15% 92%) | 标题和正文，高对比白 |
| textMuted | `--muted-foreground` | `text-muted-foreground` | hsl(210 10% 55%) | 占位符、时间戳、辅助说明 |
| primary | `--primary` | `bg-primary` / `text-primary` | hsl(195 75% 52%) | 青蓝主交互，CTA、激活导航、发送按钮 |
| primaryForeground | `--primary-foreground` | `text-primary-foreground` | hsl(210 30% 6%) | primary 上的深色文字/图标 |
| accent | `--accent` | `bg-accent` | hsl(210 20% 18%) | hover/focus 浅底、选中态、Skeleton |
| accentForeground | `--accent-foreground` | `text-accent-foreground` | hsl(210 15% 80%) | accent 上的文字和图标 |
| border | `--border` | `border-border` | hsl(210 15% 20%) | 输入框、卡片、分隔线边界 |

**语义色提示**:
- 成功（已处理）: bg `hsl(170 60% 15%)` / border `hsl(170 50% 35%)` / text `hsl(170 50% 65%)`，与 primary 同属冷色系，饱和度对齐
- 警告（处理中）: bg `hsl(40 50% 12%)` / border `hsl(40 45% 35%)` / text `hsl(40 60% 60%)`，暖色点缀但压低亮度避免跳脱
- 错误（失败）: bg `hsl(0 40% 12%)` / border `hsl(0 40% 35%)` / text `hsl(0 50% 60%)`，红色偏暗与深色底融合

## 4. 字体与节奏

- **font-display**: Space Grotesk —— 几何无衬线，科技感与清晰度平衡，适合标题和导航
- **font-body**: Noto Sans SC —— 中文正文清晰可读，与 Space Grotesk 搭配保持现代感
- **字号**: H1 text-4xl；H2 text-2xl；body text-base；muted text-sm
- **圆角**: subtle —— `rounded-lg`（卡片、气泡）、`rounded-xl`（模态、弹层）、`rounded-full`（按钮、状态标签），保持现代但不幼稚

## 5. 全局布局契约

- **Reference Layout Use**: 按需求结构推导 —— 左侧固定侧边栏 + 右侧内容区，三页切换
- **Page / Section Order**: 首页（问答对话）/ 文档管理 / 系统设置，与需求文档 1:1 对齐
- **Standard Content Zone**: 右侧内容区 `max-w-4xl` + `mx-auto`，对话区域和设置表单居中，文档列表可全宽利用
- **Shell / Frame Alignment**: 侧边栏固定宽度 260px，右侧内容区独立滚动，内容容器与框架同宽
- **Padding & Rhythm**: 侧边栏 `p-6`，内容区 `px-6 md:px-8 lg:px-10 py-8`，卡片内 `p-5`，保持 8px 倍数节奏
- **Full-bleed Zones**: 无全宽区域，所有内容受 Standard Content Zone 约束
- **Local Narrowing**: 设置表单在内容区内收窄至 `max-w-2xl`；对话气泡 `max-w-[70%]`
- **Overflow Strategy**: 文档列表表格使用 `overflow-x-auto`；对话区域 `overflow-y-auto` 独立滚动
- **Flexibility Boundary**: 允许移动端侧边栏折叠、卡片内边距微调；全局 max-w、圆角系统、主色和毛玻璃效果保持一致

## 6. 视觉与动效

- **装饰**: 毛玻璃 blur + 细边框 + 青蓝微光渐变
- **阴影/边界**: 中 —— 卡片 `shadow-lg` + `ring-1 ring-border`，侧边栏 `backdrop-blur-xl` + 半透明底
- **动效**: 精致 —— 导航切换 200ms fade，对话气泡 300ms slide-up + fade-in，文档卡片 hover 时 border 亮起青蓝微光，按钮 hover 时 primary 饱和度提升 10%

## 7. 组件原则

- 按钮、表单、菜单、卡片必须有 Default / Hover / Active / Focus / Disabled 状态
- Primary 承担发送、上传、保存等主行动；Secondary/Outline 用 `border-border` + `bg-transparent`；Ghost 和菜单项用 accent 承接 hover/focus/selected
- 加载与空状态：Skeleton 使用 accent 底色 + 微光扫过动画；空状态用 textMuted 图标 + 引导文案，延续冷色克制语言

## 8. Image Direction

- **Image Role**: 无强制图片需求，优先通过排版、色彩和局部图形建立视觉记忆点
- **Image Art Direction**: 无
- **Image Prompt Keywords**: 无
- **Image Avoidance**: 无

## 9. Anti-patterns

- **Split personality**: 三页之间切换 max-w、圆角或阴影语言；全站共享同一套 Frosted Terminal 视觉系统
- **Phantom tokens**: 编造 shadcn/ui 不存在的 CSS 变量；只使用已定义 token 或在主题里补齐
- **Default SaaS drift**: 回到默认蓝按钮、通用紫渐变和无意义卡片堆叠；用青蓝 primary + 毛玻璃侧边栏塑造本产品独有界面
- **Invisible interaction**: hover、active 做了，focus-visible 丢了；每个可交互元素都要有键盘可见的 `ring-2 ring-primary` 状态
- **Mono-hue tyranny**: 主色铺满主按钮、tab 激活、icon、边框、链接、图表；按 60-30-10 把 primary 收回到发送按钮、激活导航和关键状态标识，其余交由 accent / 中性色
- **Status color drift**: 成功/警告/错误饱和度远高于主色，主色克制而状态色刺眼；语义色饱和度需与 primary 对齐 ±15%，在深色底上压低亮度保持融合