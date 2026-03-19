# PolicyPulse — 政策风险雷达

为小型企业主和创业者提供实时、易懂的宏观经济与政策风险预警与解读。

## 核心功能

- **每日政策摘要与风险等级标记** — 自动聚合全球政策动态，按严重/高/中/低四级风险分类
- **受影响行业/业务类型提示** — 智能识别政策对10大行业的影响程度
- **关键政策原文与 AI 解读对照** — 原文与"人话解读"并排对照，快速理解政策含义
- **订阅付费体系** — 基础版免费 + 专业版 $14.99/月
- **深色模式** — 完整的明暗主题切换

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: Tailwind CSS v4 + lucide-react 图标
- **状态管理**: Zustand (带 localStorage 持久化)
- **测试**: Jest + React Testing Library
- **语言**: TypeScript (strict mode)

## 快速开始

```bash
cd apps/policypulse
npm install
npm run dev
```

打开 http://localhost:3000 查看应用。

## 项目结构

```
src/
├── app/                  # Next.js App Router 页面
│   ├── page.tsx          # 首页 - 风险概览仪表盘
│   ├── policies/         # 政策追踪列表与详情
│   ├── industries/       # 行业视图
│   ├── pricing/          # 订阅方案
│   ├── settings/         # 用户设置
│   └── api/              # API 路由
├── components/           # 可复用 UI 组件
├── lib/                  # 工具函数与 mock 数据
├── store/                # Zustand 状态管理
├── types/                # TypeScript 类型定义
└── __tests__/            # 单元测试
```

## 测试

```bash
npm test
```

## 变现策略

| 方案 | 价格 | 特性 |
|------|------|------|
| 基础版 | 免费 | 延迟摘要、2 个行业、基础风险提示 |
| 专业版 | $14.99/月 | 实时预警、无限行业、AI 深度解读、自定义监控 |
| 专业版(年付) | $119.88/年 | 全部专业版功能 + 深度报告 + 专属分析师 |
