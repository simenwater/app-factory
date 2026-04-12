# VoiceMemo Pro

AI 驱动的语音转专业内容工具。将长篇语音备忘录或杂乱草稿，快速重写成不同风格、格式的清晰专业内容。

## 核心功能

- **语音录音转文字** — 集成 OpenAI Whisper API，高精度语音识别
- **AI 风格重写** — 支持专业商务、轻松休闲、营销推广三种语气
- **多平台格式预设** — LinkedIn 帖子、博客文章、营销邮件、推特、通用文本
- **深色模式** — 支持明暗主题切换
- **订阅付费** — Stripe 集成，支持月付和买断两种模式

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand
- **AI**: OpenAI (Whisper + GPT)
- **支付**: Stripe
- **测试**: Jest + Testing Library

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 配置 OPENAI_API_KEY 等环境变量
# 编辑 .env 文件

# 启动开发服务器
npm run dev
```

## 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `OPENAI_API_KEY` | 是 | OpenAI API 密钥 |
| `OPENAI_MODEL` | 否 | GPT 模型名（默认 gpt-4o-mini） |
| `OPENAI_BASE_URL` | 否 | API 端点（兼容代理） |
| `STRIPE_SECRET_KEY` | 否 | Stripe 密钥 |
| `STRIPE_WEBHOOK_SECRET` | 否 | Stripe Webhook 密钥 |
| `STRIPE_MONTHLY_PRICE_ID` | 否 | 月付价格 ID |
| `STRIPE_LIFETIME_PRICE_ID` | 否 | 买断价格 ID |

## 变现策略

- **免费版**: 每月 10 分钟转录额度
- **专业版**: $9.9/月，500 分钟转录额度 + 全部功能
- **买断版**: $49.9 一次性，本地处理无限使用
