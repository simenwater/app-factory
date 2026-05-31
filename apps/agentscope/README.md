# AgentScope

**轻量级 AI 编码代理流量监控工具** — 让开发者实时查看编码助手（如 Claude Code、Codex）发送给模型的完整请求和响应。

## 功能特性

- **实时流量监控**：捕获并展示 AI 代理的完整请求/响应日志
- **Token 消耗统计**：成本估算仪表盘，按模型、提供商分组统计
- **日志导出**：支持 JSON / CSV 格式导出，用于调试或审计
- **多代理支持**：同时监控多个 AI 编码代理
- **深色/亮色模式**：现代化 UI 设计
- **订阅付费**：$5/月 或 $29 终身买断

## 快速开始

```bash
# 安装依赖
npm install

# 启动 Web UI（端口 3000）
npm run dev

# 启动代理服务器（端口 8787）
npm run proxy
```

## 使用方式

1. 启动 AgentScope 代理服务器
2. 将 AI 代理的 API Base URL 指向 `http://localhost:8787`
3. 打开 `http://localhost:3000` 查看实时监控面板

示例配置：
```bash
# Claude Code
export ANTHROPIC_API_BASE=http://localhost:8787

# OpenAI / Codex
export OPENAI_API_BASE=http://localhost:8787
```

## 技术栈

- **前端**：Next.js 15 + React 19 + Tailwind CSS 4
- **状态管理**：Zustand
- **代理服务器**：Node.js HTTP Proxy
- **测试**：Jest + Testing Library

## 项目结构

```
apps/agentscope/
├── src/
│   ├── app/              # Next.js App Router 页面和 API
│   ├── components/       # React UI 组件
│   ├── lib/              # 核心逻辑
│   │   ├── pricing.ts    # 模型定价与成本计算
│   │   ├── store.ts      # Zustand 全局状态
│   │   ├── export.ts     # 日志导出
│   │   ├── format.ts     # 数据格式化
│   │   ├── mock-data.ts  # 演示数据生成
│   │   └── proxy-server.ts # 代理服务器
│   ├── types/            # TypeScript 类型定义
│   └── __tests__/        # 单元测试
├── package.json
└── README.md
```

## 定价

| 计划 | 价格 | 功能 |
|------|------|------|
| Free | $0 | 100 条日志、基础统计 |
| Pro | $5/月 | 无限日志、完整统计、多代理 |
| Pro 终身 | $29 | Pro 全部功能 + 终身更新 |
