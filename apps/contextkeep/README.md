# ContextKeep

> AI 编码助手的持久化记忆层 — 防止上下文腐烂，跨会话保留项目上下文

## 为什么需要 ContextKeep？

AI 编码助手（如 Claude Code、Copilot、Codex）在长时间编码会话中会逐渐"遗忘"之前讨论过的项目架构、代码决策和上下文信息。**ContextKeep** 解决了这个问题：

- **自动索引** — 自动分析项目代码结构，提取函数、类、模块关系
- **持久记忆** — 跨会话保留项目上下文，AI 助手永远不会忘记
- **智能检索** — 基于向量相似度检索最相关的代码上下文
- **一键注入** — 生成结构化上下文摘要，直接粘贴给 AI 助手

## 功能特性

### 🔍 项目上下文自动索引
- 扫描工作区所有代码文件
- 智能提取函数、类、模块定义
- 自动生成文件级摘要和代码片段索引
- 支持 17+ 编程语言

### 🧠 跨会话记忆
- 基于 TF-IDF 向量化的本地语义搜索
- 文件变更自动增量更新
- 支持手动添加架构决策笔记
- 记忆持久化存储，重启 VS Code 后自动恢复

### 📋 上下文注入
- 输入当前任务描述，自动检索相关上下文
- 格式化输出，可直接复制粘贴给 AI 助手
- 智能排序，最相关的内容优先展示

### 🎨 VS Code 深度集成
- 侧边栏面板：搜索、注入、笔记三合一
- 命令面板：快速访问所有功能
- 状态栏：实时显示记忆统计
- 右键菜单：选中代码直接添加笔记
- 完整支持深色/浅色主题

## 安装

### 从 VSIX 安装（开发版）
```bash
cd apps/contextkeep
npm install
npm run compile
npx vsce package
```
然后在 VS Code 中: `Extensions` → `...` → `Install from VSIX`

## 使用方式

### 1. 索引项目
- 命令面板: `ContextKeep: 索引当前项目`
- 或点击侧边栏底部的"索引当前项目"按钮

### 2. 搜索记忆
- 命令面板: `ContextKeep: 搜索记忆`
- 或在侧边栏搜索框输入关键词

### 3. 注入上下文
- 命令面板: `ContextKeep: 注入上下文到剪贴板`
- 或在侧边栏"注入"标签页描述任务
- 生成的上下文会自动复制到剪贴板

### 4. 添加笔记
- 命令面板: `ContextKeep: 添加上下文笔记`
- 或选中代码后右键 → `ContextKeep: 添加上下文笔记`
- 或在侧边栏"笔记"标签页直接输入

## 技术架构

```
src/
├── extension.ts                 # 扩展入口
├── core/
│   ├── embeddings.ts            # TF-IDF 文本嵌入引擎
│   ├── vectorStore.ts           # 本地向量数据库
│   ├── indexer.ts               # 项目文件索引器
│   └── memoryManager.ts         # 跨会话记忆管理器
├── providers/
│   ├── sidebarProvider.ts       # 侧边栏 WebView
│   └── statusBar.ts             # 状态栏组件
├── commands/
│   └── index.ts                 # 命令注册
├── subscription/
│   └── subscriptionManager.ts   # 订阅管理
└── utils/
    ├── fileWatcher.ts           # 文件变更监听
    └── config.ts                # 配置管理
```

### 核心设计

- **嵌入引擎**: 基于 TF-IDF + 哈希投影的轻量级文本嵌入，无需外部 API
- **向量存储**: 内存向量数组 + 暴力搜索，适合万级数据量；LRU 淘汰策略
- **持久化**: JSON 序列化到 VS Code globalStorage，自动防抖保存
- **增量索引**: 文件变更监听 + 防抖触发，避免频繁重建索引

## 配置项

| 配置 | 默认值 | 说明 |
|------|--------|------|
| `contextkeep.autoIndex` | `true` | 自动索引文件变更 |
| `contextkeep.maxFileSize` | `102400` | 最大索引文件大小（字节） |
| `contextkeep.excludePatterns` | `[...]` | 排除的文件模式 |
| `contextkeep.maxMemoryItems` | `5000` | 最大记忆条目数 |
| `contextkeep.topKResults` | `10` | 检索返回的最大结果数 |

## 开发

```bash
# 安装依赖
npm install

# 编译
npm run compile

# 监听模式
npm run watch

# 运行测试
npm test

# 打包
npx vsce package
```

## 变现计划

| 版本 | 价格 | 功能 |
|------|------|------|
| Free | $0 | 本地记忆（5000 条）、基础搜索 |
| Pro | $5/月 | 无限记忆、云同步、团队共享、高级检索 |

## License

MIT
