# VoiceFlow AI - 智能语音笔记

AI 语音笔记整理工具：将口语录音自动转化为结构化、可编辑的文本，并支持多种输出格式。

## 功能特性

- **高精度语音转文字** - 集成 OpenAI Whisper API，支持中英文混合
- **AI 自动摘要** - 智能提炼会议纪要、关键要点和待办事项
- **多格式导出** - 支持 Markdown/Obsidian、Notion、Email 格式
- **深色模式** - 现代 UI 设计，支持明暗主题切换
- **订阅系统** - 免费试用 3 次，月度/年度订阅计划

## 技术栈

- **框架**: Next.js 15 + React 19
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand
- **AI**: OpenAI Whisper + GPT-4o-mini
- **语言**: TypeScript
- **测试**: Jest + Testing Library

## 快速开始

```bash
# 安装依赖
npm install

# 设置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加 OPENAI_API_KEY

# 开发模式
npm run dev

# 运行测试
npm test

# 构建
npm run build
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API 密钥 |

## 项目结构

```
src/
├── app/           # Next.js App Router 页面
│   ├── api/       # API 路由 (转录/摘要)
│   └── page.tsx   # 主页面
├── components/    # React 组件
├── lib/           # 工具库 (转录/摘要/导出)
├── store/         # Zustand 状态管理
├── types/         # TypeScript 类型定义
└── __tests__/     # 单元测试
```

## 变现策略

- 免费版：3 次录音转录
- 月度版：$9.9/月，无限转录
- 年度版：$49/年，全部功能
