# VoicePolish — 语音笔记润色工具

> 录音转文字，AI 自动润色成邮件、推文或博客草稿，让语音笔记真正可用。

## 功能特性

- **一键语音录制**：浏览器原生录音，支持实时时长显示
- **AI 转录**：基于 OpenAI Whisper，支持中英文语音识别
- **智能润色**：GPT 驱动的文本润色，支持多种输出格式
- **多格式导出**：邮件、推文、博客、摘要、会议纪要
- **深色模式**：完整的明暗主题支持
- **用量追踪**：实时显示本月转录用量
- **订阅付费**：Stripe 集成的订阅体系

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript (strict mode)
- **UI**: React 19 + Tailwind CSS v4
- **状态管理**: Zustand (with persist)
- **AI**: OpenAI (Whisper + GPT-4o-mini)
- **支付**: Stripe Subscriptions
- **测试**: Jest + React Testing Library
- **图标**: Lucide React

## 快速开始

```bash
cd apps/voicepolish
npm install
cp .env.example .env.local
# 填写 API Keys
npm run dev
```

访问 http://localhost:3000

## 环境变量

| 变量 | 说明 |
|------|------|
| `OPENAI_API_KEY` | OpenAI API Key |
| `STRIPE_SECRET_KEY` | Stripe 密钥 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 密钥 |
| `STRIPE_PRICE_ID` | Stripe 价格 ID |
| `NEXT_PUBLIC_APP_URL` | 应用 URL |

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── transcribe/   # Whisper 转录接口
│   │   ├── polish/        # GPT 润色接口
│   │   ├── checkout/      # Stripe 支付接口
│   │   ├── webhook/       # Stripe Webhook
│   │   └── export/        # 文件导出接口
│   ├── history/           # 历史记录页
│   ├── pricing/           # 订阅方案页
│   ├── settings/          # 设置页
│   ├── layout.tsx
│   ├── page.tsx           # 首页（录音+润色）
│   └── globals.css
├── components/            # UI 组件
├── lib/                   # 工具函数与服务
├── store/                 # Zustand 状态管理
├── types/                 # TypeScript 类型定义
└── __tests__/             # 单元测试
```

## 测试

```bash
npm test
```

## 订阅方案

| 方案 | 价格 | 转录时长 | 格式 |
|------|------|----------|------|
| Free | $0/月 | 30 分钟 | 摘要、邮件 |
| Pro  | $5/月 | 600 分钟 | 全部格式 |
