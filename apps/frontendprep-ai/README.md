# FrontendPrep AI

AI 驱动的前端面试模拟与个性化练习平台。

## 核心功能

- **AI 模拟面试** — 行为面试 + 技术面试全覆盖，支持 React/CSS/JS 专项，多难度级别
- **代码实时评估** — 提交代码片段获取评分、问题分析和优化建议
- **个性化弱点分析** — AI 分析面试和代码记录，定位薄弱领域并生成练习计划

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **状态管理**: Zustand 5 (with persist)
- **AI**: OpenAI GPT-4o-mini (带模拟 fallback)
- **测试**: Jest + Testing Library
- **语言**: TypeScript (strict mode)

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量（可选，不配置则使用模拟数据）
cp .env.example .env.local
# 编辑 .env.local 添加 OPENAI_API_KEY

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/                 # Next.js App Router 页面
│   ├── api/            # API 路由
│   │   ├── interview/  # 面试对话 API
│   │   ├── evaluate/   # 代码评估 API
│   │   └── analyze/    # 弱点分析 API
│   ├── interview/      # 模拟面试页面
│   ├── review/         # 代码评估页面
│   ├── plan/           # 练习计划页面
│   └── pricing/        # 定价页面
├── components/          # 共享 UI 组件
├── lib/                # 工具函数和 LLM 封装
├── store/              # Zustand 全局状态
└── types/              # TypeScript 类型定义
```

## 变现策略

| 方案 | 价格 | 包含内容 |
|------|------|----------|
| Free | $0 | 3 次面试、基础代码评估 |
| Pro | $9.9/月 | 无限面试、详细报告、练习计划 |
| 面试冲刺包 | $49 | Pro 全部功能 + 一对一辅导 |

## 测试

```bash
npm test
```
