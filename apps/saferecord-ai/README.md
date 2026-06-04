# SafeRecord AI

> 永不中断的智能录音应用，内置 AI 转录并支持一键访问历史转录文本

## 功能特性

- **后台防中断录音** — 利用 WakeLock API + 分片录制 + 页面保护机制，确保录音不被意外中断
- **AI 语音转文字** — 集成 OpenAI Whisper API，支持中/英/日/韩/西/法/德 多语言自动识别
- **时间轴同步** — 转录文本与音频时间轴精确对齐，点击即可跳转播放
- **订阅制变现** — 免费版每月 10 分钟转录，Pro 版 $4.99/月无限转录
- **深色模式** — 支持亮色/暗色/跟随系统

## 技术栈

- **框架**: Next.js 15 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand
- **录音**: Web Audio API + MediaRecorder
- **AI**: OpenAI Whisper API
- **测试**: Jest + Testing Library

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加 OPENAI_API_KEY

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建生产版本
npm run build
```

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI API 密钥，用于 Whisper 转录 |

## 项目结构

```
src/
├── app/              # Next.js App Router 页面
│   ├── api/          # API 路由（转录代理）
│   ├── layout.tsx    # 根布局
│   └── page.tsx      # 主页
├── components/       # UI 组件
│   ├── RecordButton.tsx       # 录音控制按钮
│   ├── RecordingList.tsx      # 录音历史列表
│   ├── TranscriptionView.tsx  # 转录详情视图
│   ├── SubscriptionBanner.tsx # 订阅引导
│   ├── SettingsPanel.tsx      # 设置面板
│   └── ThemeProvider.tsx      # 主题管理
├── lib/              # 核心逻辑
│   ├── recordingEngine.ts     # 防中断录音引擎
│   ├── transcriptionService.ts # AI 转录服务
│   └── formatters.ts          # 工具函数
├── store/            # 状态管理
│   └── recordingStore.ts      # Zustand Store
├── types/            # TypeScript 类型定义
│   └── index.ts
└── __tests__/        # 单元测试
    ├── formatters.test.ts
    ├── recordingStore.test.ts
    └── transcriptionService.test.ts
```
