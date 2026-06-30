/**
 * @fileoverview 首页 - 产品介绍和 CTA
 */

import Link from 'next/link';
import {
  Bot,
  Zap,
  GitBranch,
  RefreshCw,
  Shield,
  ArrowRight,
  Code2,
  FileText,
  Sparkles,
} from 'lucide-react';

/** 特性列表 */
const FEATURES = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: '一键分析',
    description: '输入 GitHub URL，自动解析代码结构、框架、依赖和项目约定。',
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'LLM 增强生成',
    description: '基于 AI 生成精准的配置文件，而非通用模板，让 AI 助手真正理解你的项目。',
  },
  {
    icon: <RefreshCw className="h-6 w-6" />,
    title: '多标准同步',
    description: '同时支持 Cursor (AGENTS.md)、Claude (CLAUDE.md)、Copilot 三大工具标准。',
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    title: '自动更新',
    description: '代码库变更时自动同步更新配置文件，始终保持最新状态。',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: '团队协作',
    description: '团队共享配置模板，确保所有成员的 AI 工具使用统一上下文。',
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: '智能检测',
    description: '自动识别 50+ 框架、构建工具和测试框架，覆盖主流技术栈。',
  },
];

/** 支持的工具标准 */
const TOOL_STANDARDS = [
  { name: 'Cursor', file: 'AGENTS.md', color: 'bg-violet-500' },
  { name: 'Claude Code', file: 'CLAUDE.md', color: 'bg-amber-500' },
  { name: 'GitHub Copilot', file: 'copilot-instructions.md', color: 'bg-blue-500' },
];

/**
 * 首页组件
 * @returns {JSX.Element}
 */
export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-950 dark:to-violet-950/30" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzM1ZjUiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-60" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pt-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
              <Bot className="h-4 w-4" />
              AI 驱动的代理配置生成工具
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl dark:text-white">
              让 AI 编码助手
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {' '}真正理解{' '}
              </span>
              你的代码库
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-400">
              一键分析 GitHub 仓库，自动生成标准化的 AGENTS.md 配置文件。
              支持 Cursor、Claude、Copilot 多工具标准同步。
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-200 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl dark:shadow-violet-900/30"
              >
                免费开始使用
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-violet-300 hover:bg-violet-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-violet-600"
              >
                查看定价
              </Link>
            </div>

            {/* Supported standards */}
            <div className="mt-14 flex items-center justify-center gap-6">
              {TOOL_STANDARDS.map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm dark:bg-gray-900"
                >
                  <div className={`h-2.5 w-2.5 rounded-full ${tool.color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tool.name}
                  </span>
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {tool.file}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="relative -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400">AGENTS.md — Generated by AgentContext</span>
            </div>
            <pre className="p-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <code>{`# AGENTS.md - vercel/next.js

## Project Overview
Next.js is a React framework for production-grade
web applications with server-side rendering and
static site generation.

## Tech Stack
- **Framework**: Next.js 14, React 18
- **Language**: TypeScript
- **Testing**: Jest, Playwright
- **Package Manager**: pnpm

## Project Structure
\`\`\`
packages/next/     # Core framework
packages/create-next-app/  # CLI tool
test/              # Test suites
docs/              # Documentation
\`\`\`

## Development Commands
\`\`\`bash
pnpm install     # Install dependencies
pnpm dev         # Start development
pnpm build       # Build for production
pnpm test        # Run tests
\`\`\``}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              为什么选择 AgentContext?
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              专为 AI 开发者设计，让每个 AI 编码工具都能精准理解你的项目
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-violet-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-violet-800"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-600 transition-colors group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white dark:from-violet-900 dark:to-indigo-900 dark:text-violet-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              三步完成
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: <GitBranch className="h-6 w-6" />,
                title: '输入仓库 URL',
                desc: '粘贴任意公开 GitHub 仓库的链接',
              },
              {
                step: '02',
                icon: <Sparkles className="h-6 w-6" />,
                title: 'AI 自动分析',
                desc: '智能解析项目结构、框架、依赖和代码约定',
              },
              {
                step: '03',
                icon: <FileText className="h-6 w-6" />,
                title: '下载配置文件',
                desc: '获取为你项目量身定制的 AGENTS.md 配置文件',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
                  {item.icon}
                </div>
                <div className="mb-2 text-sm font-bold text-violet-500">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-12 text-center shadow-2xl shadow-violet-200 dark:shadow-violet-900/30">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            准备好让 AI 更懂你的代码了吗？
          </h2>
          <p className="mt-4 text-lg text-violet-100">
            免费开始，无需信用卡。每月 3 个仓库分析额度。
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-violet-700 shadow-md transition-all hover:bg-violet-50 hover:shadow-lg"
          >
            立即开始
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
