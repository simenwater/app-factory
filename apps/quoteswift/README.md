# QuoteSwift

专为自由职业者和小型服务商设计的专业报价单生成器。输入服务项目和工时，一键生成专业 PDF 报价单并通过短信/邮件发送。

## 功能特性

- **服务项目库** — 自定义服务项目与单价，分类管理，快速复用
- **PDF 报价单生成** — 基于行业模板，一键生成专业 PDF 报价单
- **利润计算器** — 输入收入和成本，快速评估项目盈利能力
- **模板系统** — 内置清洁、维修、园艺、装修等行业模板
- **深色模式** — 完整的深色/浅色主题切换
- **移动优先** — 响应式设计，PWA 支持

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS v4
- **状态管理**: Zustand (with persist)
- **PDF**: jsPDF + jspdf-autotable
- **图标**: Lucide React
- **测试**: Jest + Testing Library
- **语言**: TypeScript 5

## 快速开始

```bash
npm install
npm run dev
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint |
| `npm test` | 运行单元测试 |

## 变现策略

- **免费版**: 3 个模板, 10 份报价单, 基础功能
- **Pro 版** ($4.99/月): 无限模板, 无限报价单, 自定义 Logo, 云端保存
