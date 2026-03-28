# ChartFlow AI

专为工程师设计的文本转图表工具，通过自然语言描述自动生成可视化图表。

## 功能特性

- **自然语言输入解析** — AI 智能解析文本描述，自动推断最适合的图表类型
- **多格式渲染** — 同时支持 Mermaid 和 PlantUML 两种主流格式
- **丰富图表类型** — 流程图、时序图、类图、ER 图、甘特图、饼图、思维导图、时间线、状态图、协议格式
- **一键导出** — 导出 PNG/SVG 高清图片，或生成嵌入代码
- **深色模式** — 完整的暗色主题支持
- **历史记录** — 本地保存生成历史，随时回顾

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **图表渲染**: Mermaid + PlantUML
- **状态管理**: Zustand 5
- **AI**: OpenAI GPT-4o-mini
- **导出**: html-to-image
- **测试**: Jest + Testing Library

## 快速开始

```bash
cd apps/chartflow-ai
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

配置 `OPENAI_API_KEY` 以启用 AI 功能。未配置时使用内置模拟数据。

## 变现策略

- **免费版**: 每月 10 次生成、5 次导出
- **Pro 版** ($9/月): 无限生成和导出，高级模板
