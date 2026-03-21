# ChinaCompass — 中国出海企业全球合规AI助手

为中国出海企业提供全球市场合规AI助手，实时监控目标国家政策变化，提供中文解读和合规建议，降低出海风险。

## 功能

- **多国政策实时监控** — 覆盖美、欧、日、东南亚等10+国家和地区
- **AI中文解读与合规建议** — 将复杂外文政策翻译并解读为可执行的中文建议
- **出海风险评估与预警** — 智能评估风险等级，及时推送预警
- **本地化运营指南** — 税务、劳工、数据保护等领域实操清单
- **同行案例与最佳实践库** — 中国企业出海真实案例与经验总结
- **订阅与定价** — 基础版免费，专业版¥999/月，企业版定制

## 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS 4
- **状态管理**: Zustand
- **AI**: OpenAI 兼容接口（支持文心/通义等国产大模型）
- **图标**: Lucide React
- **部署**: Standalone 模式

## 快速开始

```bash
cd apps/chinacompass
npm install
npm run dev
```

访问 http://localhost:3000

## 环境变量

复制 `.env.example` 为 `.env.local` 并配置：

```bash
cp .env.example .env.local
```

| 变量 | 说明 | 必填 |
|------|------|------|
| `OPENAI_API_KEY` | AI服务API密钥 | 否（有默认回退） |
| `OPENAI_BASE_URL` | AI服务地址 | 否 |
| `OPENAI_MODEL` | 模型名称 | 否（默认gpt-4o-mini） |

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── policies/          # 政策监控
│   ├── advisor/           # AI合规顾问
│   ├── risk/              # 风险评估
│   ├── guides/            # 运营指南
│   ├── cases/             # 案例库
│   ├── pricing/           # 订阅方案
│   └── api/               # API路由
├── components/            # 共享组件
├── lib/                   # 工具和服务
├── store/                 # 状态管理
└── types/                 # 类型定义
```
