/**
 * @fileoverview 内置 AGENTS.md 模板库
 */

import { Template, TemplateCategory } from "@/types";

/**
 * 生成通用 AGENTS.md 模板内容
 * @param projectName - 项目名称
 * @returns 格式化后的 Markdown 内容
 */
function generalTemplate(projectName: string = "MyProject"): string {
  return `# AGENTS.md — ${projectName}

## Project Overview
Describe your project here. What does it do? What problem does it solve?

## Tech Stack
- Language: 
- Framework: 
- Database: 
- Deployment: 

## Code Style & Conventions
- Follow existing code patterns
- Use meaningful variable and function names
- Write JSDoc comments for public APIs
- Keep functions small and focused

## File Structure
\`\`\`
src/
├── components/    # UI components
├── lib/           # Utility functions
├── types/         # TypeScript types
└── app/           # Application routes
\`\`\`

## Testing
- Write unit tests for business logic
- Use integration tests for API endpoints
- Maintain test coverage above 80%

## Important Notes
- Always handle errors gracefully
- Follow the principle of least surprise
- Document non-obvious decisions
`;
}

/**
 * 生成前端开发 AGENTS.md 模板
 * @param projectName - 项目名称
 * @returns 格式化后的 Markdown 内容
 */
function frontendTemplate(projectName: string = "MyApp"): string {
  return `# AGENTS.md — ${projectName}

## Project Overview
A modern frontend application built with React/Next.js.

## Tech Stack
- React 19 with TypeScript
- Next.js App Router
- Tailwind CSS for styling
- Zustand for state management

## Component Guidelines
- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small (< 150 lines)
- Use \`use client\` directive only when needed

## Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Support dark mode via CSS variables
- Avoid inline styles

## State Management
- Use Zustand for global state
- Prefer local state when possible
- Avoid prop drilling — use context or stores

## Accessibility
- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios

## Performance
- Lazy load routes and heavy components
- Optimize images with next/image
- Minimize bundle size
- Use React.memo for expensive renders
`;
}

/**
 * 生成后端开发 AGENTS.md 模板
 * @param projectName - 项目名称
 * @returns 格式化后的 Markdown 内容
 */
function backendTemplate(projectName: string = "MyAPI"): string {
  return `# AGENTS.md — ${projectName}

## Project Overview
A RESTful/GraphQL API service.

## Tech Stack
- Runtime: Node.js / Python / Go
- Framework: Express / FastAPI / Gin
- Database: PostgreSQL / MongoDB
- Cache: Redis

## API Design
- Follow RESTful conventions
- Use proper HTTP methods and status codes
- Version APIs (e.g., /api/v1/)
- Document all endpoints with OpenAPI/Swagger

## Database
- Use migrations for schema changes
- Write efficient queries — avoid N+1
- Index frequently queried columns
- Use transactions for multi-step operations

## Security
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Follow OWASP best practices

## Error Handling
- Return consistent error response format
- Log errors with context
- Never expose internal errors to clients
- Use appropriate HTTP status codes

## Testing
- Unit test business logic
- Integration test API endpoints
- Test edge cases and error paths
- Mock external dependencies
`;
}

/**
 * 生成全栈开发 AGENTS.md 模板
 * @param projectName - 项目名称
 * @returns 格式化后的 Markdown 内容
 */
function fullstackTemplate(projectName: string = "MyFullStackApp"): string {
  return `# AGENTS.md — ${projectName}

## Project Overview
A full-stack web application with frontend and backend.

## Tech Stack
- Frontend: Next.js + React + Tailwind CSS
- Backend: Next.js API Routes / Express
- Database: PostgreSQL with Prisma ORM
- Auth: NextAuth.js / Clerk
- Deployment: Vercel / Docker

## Architecture
- Monorepo structure with shared types
- Server components for data fetching
- Client components for interactivity
- API routes for backend logic

## Frontend Guidelines
- Use App Router with server components by default
- Client components only for interactivity
- Responsive design with Tailwind
- Dark mode support

## Backend Guidelines
- Validate requests with Zod
- Use Prisma for database operations
- Implement proper error handling
- Add authentication middleware

## Database
- Define schema in Prisma
- Use migrations for changes
- Seed database for development
- Handle relations properly

## Deployment
- Environment variables for config
- CI/CD pipeline for testing
- Staging environment for review
- Production monitoring setup
`;
}

/**
 * 生成移动端开发 AGENTS.md 模板
 * @param projectName - 项目名称
 * @returns 格式化后的 Markdown 内容
 */
function mobileTemplate(projectName: string = "MyMobileApp"): string {
  return `# AGENTS.md — ${projectName}

## Project Overview
A cross-platform mobile application.

## Tech Stack
- Framework: React Native / Flutter / SwiftUI
- State: Redux / Provider / SwiftUI State
- Navigation: React Navigation / GoRouter
- API: REST / GraphQL

## Design Guidelines
- Follow platform-specific design guidelines
- Support both iOS and Android
- Implement adaptive layouts
- Handle notch/safe areas properly

## Navigation
- Use stack-based navigation
- Implement deep linking
- Handle back button properly
- Maintain navigation state

## Performance
- Optimize list rendering
- Minimize re-renders
- Use lazy loading for screens
- Cache network responses

## Offline Support
- Cache essential data locally
- Queue actions when offline
- Sync when connection restored
- Show clear offline indicators

## Testing
- Unit test business logic
- Widget/component tests
- Integration tests for flows
- Device-specific testing
`;
}

/**
 * 生成 DevOps AGENTS.md 模板
 * @param projectName - 项目名称
 * @returns 格式化后的 Markdown 内容
 */
function devopsTemplate(projectName: string = "MyInfra"): string {
  return `# AGENTS.md — ${projectName}

## Project Overview
Infrastructure and deployment configuration.

## Tech Stack
- IaC: Terraform / Pulumi
- Containers: Docker + Kubernetes
- CI/CD: GitHub Actions / GitLab CI
- Monitoring: Prometheus + Grafana

## Infrastructure
- Use Infrastructure as Code (IaC)
- Keep environments consistent
- Document all resources
- Use modules for reusability

## Containers
- Minimal base images
- Multi-stage builds
- Non-root users
- Health checks configured

## CI/CD
- Automated testing on PR
- Staging deployment on merge
- Production deployment with approval
- Rollback procedures documented

## Security
- Scan images for vulnerabilities
- Rotate secrets regularly
- Network policies in place
- Audit logs enabled

## Monitoring
- Application metrics
- Infrastructure metrics
- Alerting rules
- Runbooks for incidents
`;
}

/**
 * 生成数据工程 AGENTS.md 模板
 * @param projectName - 项目名称
 * @returns 格式化后的 Markdown 内容
 */
function dataTemplate(projectName: string = "MyDataPipeline"): string {
  return `# AGENTS.md — ${projectName}

## Project Overview
Data processing and analytics pipeline.

## Tech Stack
- Language: Python / Scala
- Processing: Spark / Pandas / dbt
- Storage: S3 / BigQuery / Snowflake
- Orchestration: Airflow / Dagster

## Data Pipeline
- Idempotent transformations
- Schema validation at ingestion
- Data quality checks
- Lineage tracking

## Code Style
- Type hints for all functions
- Docstrings for public APIs
- Modular transformation functions
- Configuration over hardcoding

## Testing
- Unit test transformations
- Integration test pipelines
- Data quality assertions
- Test with sample datasets

## Documentation
- Document data sources
- Maintain data dictionary
- Record transformation logic
- Update pipeline diagrams
`;
}

/** 所有内置模板 */
export const builtInTemplates: Template[] = [
  {
    id: "tpl-general",
    name: "通用模板",
    description: "适用于任何类型项目的基础 AGENTS.md 模板",
    category: "general",
    content: generalTemplate(),
    tags: ["通用", "基础", "入门"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    isBuiltIn: true,
  },
  {
    id: "tpl-frontend",
    name: "前端开发模板",
    description: "React/Next.js 前端项目的最佳实践模板",
    category: "frontend",
    content: frontendTemplate(),
    tags: ["React", "Next.js", "前端", "Tailwind"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    isBuiltIn: true,
  },
  {
    id: "tpl-backend",
    name: "后端开发模板",
    description: "RESTful API 后端服务的标准化模板",
    category: "backend",
    content: backendTemplate(),
    tags: ["API", "后端", "REST", "数据库"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    isBuiltIn: true,
  },
  {
    id: "tpl-fullstack",
    name: "全栈开发模板",
    description: "全栈 Web 应用的完整配置模板",
    category: "fullstack",
    content: fullstackTemplate(),
    tags: ["全栈", "Next.js", "Prisma", "全栈"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    isBuiltIn: true,
  },
  {
    id: "tpl-mobile",
    name: "移动端开发模板",
    description: "跨平台移动应用开发的配置模板",
    category: "mobile",
    content: mobileTemplate(),
    tags: ["移动端", "React Native", "Flutter", "iOS", "Android"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    isBuiltIn: true,
  },
  {
    id: "tpl-devops",
    name: "DevOps 模板",
    description: "基础设施与 CI/CD 配置模板",
    category: "devops",
    content: devopsTemplate(),
    tags: ["DevOps", "Docker", "Kubernetes", "CI/CD"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    isBuiltIn: true,
  },
  {
    id: "tpl-data",
    name: "数据工程模板",
    description: "数据管道与分析工程的配置模板",
    category: "data",
    content: dataTemplate(),
    tags: ["数据", "ETL", "分析", "Python"],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    isBuiltIn: true,
  },
];

/**
 * 根据分类过滤模板
 * @param templates - 模板列表
 * @param category - 过滤分类
 * @returns 过滤后的模板列表
 */
export function filterTemplatesByCategory(
  templates: Template[],
  category: TemplateCategory | "all"
): Template[] {
  if (category === "all") return templates;
  return templates.filter((t) => t.category === category);
}

/**
 * 根据关键词搜索模板
 * @param templates - 模板列表
 * @param query - 搜索关键词
 * @returns 匹配的模板列表
 */
export function searchTemplates(
  templates: Template[],
  query: string
): Template[] {
  const lowerQuery = query.toLowerCase();
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * 使用模板生成项目的 AGENTS.md 内容
 * @param template - 模板对象
 * @param projectName - 项目名称
 * @returns 替换项目名后的内容
 */
export function applyTemplate(
  template: Template,
  projectName: string
): string {
  return template.content.replace(
    /# AGENTS\.md — \w+/,
    `# AGENTS.md — ${projectName}`
  );
}

/**
 * 获取分类的中文显示名称
 * @param category - 模板分类
 * @returns 中文名称
 */
export function getCategoryLabel(category: TemplateCategory | "all"): string {
  const labels: Record<TemplateCategory | "all", string> = {
    all: "全部",
    general: "通用",
    frontend: "前端",
    backend: "后端",
    fullstack: "全栈",
    mobile: "移动端",
    devops: "DevOps",
    data: "数据工程",
    custom: "自定义",
  };
  return labels[category];
}
