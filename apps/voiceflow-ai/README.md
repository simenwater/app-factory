# VoiceFlow AI — 语音笔记智能整理工具

利用 AI 为语音笔记进行智能整理、重写和格式化，提升记录和内容创作效率。

## 功能特性

- **语音录制** — 浏览器内直接录音，支持音频文件上传
- **AI 转录** — 使用 OpenAI Whisper 将语音精准转为文字
- **智能重写** — 支持 4 种风格：摘要、正式文档、要点列表、博客文章
- **多格式导出** — 支持 Markdown 和纯文本格式导出
- **深色模式** — 自动跟随系统偏好，支持手动切换
- **订阅变现** — 免费 3 次试用，$4.99/月 或 $29.99 终身买断

## 技术栈

| 技术 | 版本 |
|------|------|
| Next.js | 15.x |
| React | 19 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Zustand | 5.x |
| OpenAI SDK | 4.x |

## 快速开始

```bash
# 安装依赖
cd apps/voiceflow-ai
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入 OpenAI API Key

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── transcribe/   # Whisper 语音转文字
│   │   ├── rewrite/      # GPT 智能重写
│   │   ├── subscribe/    # Stripe 订阅
│   │   └── webhook/      # Stripe Webhook
│   ├── history/          # 历史记录页
│   ├── pricing/          # 定价页
│   ├── settings/         # 设置页
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/
│   ├── Header.tsx        # 导航栏
│   ├── RecordButton.tsx  # 录音按钮
│   ├── StyleSelector.tsx # 风格选择器
│   ├── NoteCard.tsx      # 笔记卡片
│   └── NoteDetail.tsx    # 笔记详情弹窗
├── store/
│   └── useStore.ts       # Zustand 状态管理
├── lib/
│   ├── recorder.ts       # 浏览器录音封装
│   └── export.ts         # 导出工具函数
├── types/
│   └── index.ts          # TypeScript 类型定义
└── __tests__/            # 单元测试
```

## 测试

```bash
npm test
```

## 环境变量

| 变量 | 说明 | 必须 |
|------|------|------|
| `OPENAI_API_KEY` | OpenAI API 密钥 | ✅ |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | 可选 |
| `STRIPE_PUBLISHABLE_KEY` | Stripe 公钥 | 可选 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 密钥 | 可选 |

## License

MIT
