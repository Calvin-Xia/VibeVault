# VibeVault

VibeVault 是一个可视化链接收藏夹应用，支持收藏链接、自动抓取元数据、标签/集合管理、搜索和可视化视图（瀑布流 + 知识图谱）。

## 技术栈

- **Monorepo**: pnpm workspace
- **Web**: Next.js (App Router) + TypeScript
- **UI**: TailwindCSS + shadcn/ui + Framer Motion
- **数据层**: Prisma ORM
- **数据库**: SQLite (开发环境), PostgreSQL (生产环境)
- **Auth**: NextAuth (GitHub OAuth)
- **状态/请求**: Next Server Actions
- **后台任务**: DB轮询 + cron (简化版，支持 Redis + BullMQ 扩展)

## 核心功能

### 收藏
- 输入 URL 保存为 Link
- 立即在列表中出现（optimistic UI）
- 后台异步抓取：title、description、siteName、favicon、ogImage、publishedTime
- 支持手动编辑：标题、备注、标签、集合、状态（inbox/reading/archived）

### 管理
- 标签（Tag）增删改查、给链接打多个标签
- 集合（Collection）用于分组
- 列表筛选：按标签、集合、状态、星标
- 排序：最新收藏 / 最近访问 / 域名 / 标题

### 搜索
- 基础全文搜索（标题/描述/备注/域名）
- 支持快捷键：Cmd/Ctrl + K 打开 Command Palette 搜索与跳转

### 视觉与可视化
- 视图1：瀑布流卡片 Masonry（默认）
- 视图2：知识图谱 Graph（按标签节点 + 链接节点连接）

### 导入导出
- 导出 JSON（用户全部链接/标签/集合）
- 导入 JSON（同结构，自动去重）

## 本地启动

### 1. 安装依赖

```bash
npm install -g pnpm  # 安装 pnpm（如果尚未安装）
pnpm install         # 安装所有依赖
```

### 2. 配置环境变量

创建 `.env` 文件，基于 `.env.example`：

```bash
cp .env.example .env
```

### 3. 数据库迁移

```bash
# 初始化数据库（仅首次运行）
pnpm --filter db generate
pnpm --filter db migrate dev
```

### 4. 启动开发服务器

```bash
# 启动 Web 应用
pnpm --filter web dev

# 启动 Worker（在另一个终端）
pnpm --filter worker dev
```

### 5. 访问应用

- Web 应用：http://localhost:3000
- Prisma Studio（数据库可视化）：`pnpm --filter db studio`

## 项目结构

```
├── apps/
│   ├── web/            # Next.js Web 应用
│   └── worker/         # 后台任务 Worker
├── packages/
│   └── db/             # Prisma DB 配置和 Client
└── package.json        # pnpm workspace 配置
```

## 部署

### 生产环境配置

1. 使用 PostgreSQL 数据库
2. 配置环境变量
3. 构建应用：
   ```bash
   pnpm build
   ```
4. 启动应用：
   ```bash
   pnpm start
   ```

## 贡献

欢迎提交 Issue 和 Pull Request！

## License

MIT
