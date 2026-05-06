# InvoiceFlow AI

AI 驱动的自动化发票生成与支付跟踪工具，专为自由职业者和小团队设计。

## 功能特性

- **📷 OCR 智能识别** — 拍照上传收据/合同，AI 自动提取关键信息
- **📄 一键生成 PDF** — 生成符合税务规范的专业发票
- **📧 自动付款提醒** — 发送付款提醒邮件，跟踪支付状态
- **🌙 深色模式** — 支持明暗主题切换
- **💰 订阅变现** — 免费 3 张/月，Pro 订阅 $9/月

## 技术栈

- **框架**: Next.js 15 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand
- **OCR**: Tesseract.js
- **AI 解析**: OpenAI GPT-4o-mini
- **PDF 生成**: jsPDF + jsPDF-AutoTable
- **邮件**: Nodemailer
- **测试**: Jest + Testing Library

## 快速开始

```bash
cd apps/invoiceflow-ai
npm install
npm run dev
```

## 环境变量（可选）

```env
OPENAI_API_KEY=sk-xxx          # AI 结构化解析（无则使用规则解析回退）
SMTP_HOST=smtp.gmail.com       # 邮件服务器
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=app-password
```

## 测试

```bash
npm test
```

## 项目结构

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   │   ├── ocr/         # OCR 识别 + AI 解析
│   │   ├── invoice/     # 发票生成
│   │   └── reminder/    # 付款提醒
│   ├── layout.tsx
│   └── page.tsx
├── components/           # React 组件
│   ├── Header.tsx
│   ├── ReceiptUploader.tsx
│   ├── InvoiceForm.tsx
│   ├── InvoicePreview.tsx
│   ├── PaymentTracker.tsx
│   ├── PricingCard.tsx
│   └── ThemeToggle.tsx
├── lib/                  # 核心业务逻辑
│   ├── ocr.ts
│   ├── pdf.ts
│   ├── email.ts
│   └── subscription.ts
├── store/                # 状态管理
│   └── useStore.ts
├── types/                # TypeScript 类型定义
│   └── index.ts
└── __tests__/            # 单元测试
    ├── ocr.test.ts
    ├── pdf.test.ts
    ├── email.test.ts
    └── subscription.test.ts
```
