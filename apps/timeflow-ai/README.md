# TimeFlow AI

通过文本描述快速生成美观的时间线图表，专为技术文档和项目汇报设计。

## 功能特点

- 🤖 **AI 智能生成** - 输入自然语言描述，自动提取时间和事件
- 📊 **即时预览** - 基于 Mermaid 的实时时间线渲染
- 💾 **多格式导出** - 支持 SVG/PNG 格式导出
- 🔗 **分享链接** - 一键生成时间线分享链接
- 🌙 **深色模式** - 完整支持浅色/深色主题切换
- 💎 **订阅系统** - 免费版和 Pro 版订阅框架

## 技术栈

- **框架**: Next.js 15 + React 19 + TypeScript
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand
- **图表渲染**: Mermaid
- **AI 集成**: OpenAI API
- **测试**: Jest + React Testing Library

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env.local` 文件：

```bash
# 可选：配置 OpenAI API Key 用于生产环境
# 如果不配置，将使用模拟数据
OPENAI_API_KEY=your_api_key_here
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm start
```

### 运行测试

```bash
npm test
```

## 项目结构

```
apps/timeflow-ai/
├── src/
│   ├── app/              # Next.js 应用页面
│   │   ├── api/          # API 路由
│   │   │   └── generate/ # 时间线生成 API
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx      # 主页
│   │   └── globals.css   # 全局样式
│   ├── components/       # React 组件
│   │   ├── TextInput.tsx           # 文本输入组件
│   │   ├── TimelineRenderer.tsx    # 时间线渲染组件
│   │   ├── SubscriptionBanner.tsx  # 订阅横幅
│   │   └── ThemeToggle.tsx         # 主题切换
│   ├── lib/              # 工具函数
│   │   ├── llm.ts        # LLM API 调用
│   │   ├── mermaid.ts    # Mermaid 代码生成
│   │   └── export.ts     # 导出功能
│   ├── store/            # 状态管理
│   │   └── useStore.ts   # Zustand store
│   ├── types/            # TypeScript 类型
│   │   └── index.ts
│   └── __tests__/        # 测试文件
├── public/               # 静态资源
├── package.json
├── tsconfig.json
└── README.md
```

## 核心功能实现

### 1. 文本转时间线

使用 OpenAI API 将自然语言描述转换为结构化的时间线数据：

- 智能提取日期和事件
- 自动生成时间线标题
- 支持模糊日期推断

### 2. 时间线渲染

基于 Mermaid 库实现即时渲染：

- 自动按时间排序
- 支持事件描述
- 响应式布局

### 3. 导出功能

- **SVG 导出**: 矢量格式，适合进一步编辑
- **PNG 导出**: 高清位图，适合直接使用
- **分享链接**: 一键复制分享链接

### 4. 订阅系统

- **免费版**: 每月 5 次生成
- **Pro 版**: $5/月无限生成
- **本地导出**: $29 一次性购买

## 变现策略

1. **订阅制**
   - 免费版: 5 次/月
   - Pro 版: $5/月无限生成 + 高级模板

2. **一次性购买**
   - 本地导出功能: $29 永久授权

3. **企业服务**
   - 定制开发
   - API 接入
   - 私有化部署

## 开发指南

### 添加新的时间线样式

1. 在 `src/lib/mermaid.ts` 中扩展 `generateMermaidCode` 函数
2. 在 `TimelineRenderer.tsx` 中配置新的主题变量

### 集成其他 LLM 提供商

修改 `src/app/api/generate/route.ts`，替换 OpenAI 调用逻辑。

### 自定义订阅逻辑

在 `src/store/useStore.ts` 中修改用户状态和订阅规则。

## 测试覆盖

- 单元测试: Mermaid 代码生成、状态管理
- 组件测试: React 组件渲染和交互
- API 测试: 时间线生成端点

## 部署

推荐部署平台：

- **Vercel**: 最佳性能，自动 CI/CD
- **Netlify**: 简单易用
- **Railway**: 支持容器化部署

部署前确保配置环境变量：

```bash
OPENAI_API_KEY=your_api_key_here
```

## 许可证

MIT License

## 联系方式

如有问题或建议，请创建 Issue 或 PR。
