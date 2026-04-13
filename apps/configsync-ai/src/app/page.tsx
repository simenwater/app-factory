"use client";

/**
 * @fileoverview 首页 - ConfigSync AI 产品介绍与快速入口
 */

import Link from "next/link";
import { FolderSearch, FileText, GitCompare, Zap, Shield, Globe } from "lucide-react";

/** 功能特性列表 */
const features = [
  {
    icon: FolderSearch,
    title: "智能扫描",
    description: "自动分析项目结构、语言分布、依赖框架，一键生成完整项目上下文",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: FileText,
    title: "多模板同步",
    description: "支持 Cursor、Codex、Claude Code、Copilot、Windsurf 等主流 AI 助手",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: GitCompare,
    title: "冲突检测",
    description: "智能检测不同配置文件间的冲突，提供合并建议和自动修复方案",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "一键生成",
    description: "扫描完成后一键生成所有 AI 助手的配置文件，无需手动编写",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "安全本地化",
    description: "所有扫描和生成操作在本地完成，项目代码不会上传到任何服务器",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Globe,
    title: "云端同步",
    description: "Pro 用户支持模板云同步和团队共享，多设备无缝切换",
    color: "from-teal-500 to-sky-500",
  },
];

/** 支持的 AI 助手列表 */
const assistants = [
  { name: "Cursor", file: ".cursorrules" },
  { name: "OpenAI Codex", file: "AGENTS.md" },
  { name: "Claude Code", file: "CLAUDE.md" },
  { name: "GitHub Copilot", file: "copilot-instructions.md" },
  { name: "Windsurf", file: ".windsurfrules" },
];

/**
 * 首页组件
 * @returns JSX 元素
 */
export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 mb-6">
          <Zap size={14} />
          跨 AI 助手配置管理工具
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-6xl">
          ConfigSync{" "}
          <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          一键扫描项目结构，自动生成适配 Cursor、Codex、Claude Code 等 AI 编码助手的标准化配置文件。
          告别重复配置，让每个 AI 助手都能完整理解你的项目。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/scan"
            className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30"
          >
            开始扫描项目
          </Link>
          <Link
            href="/templates"
            className="rounded-xl border border-zinc-300 bg-white px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            浏览模板
          </Link>
        </div>
      </section>

      {/* Supported Assistants */}
      <section className="py-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {assistants.map((a) => (
            <div
              key={a.name}
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <span className="font-medium text-zinc-900 dark:text-white">{a.name}</span>
              <code className="text-xs text-zinc-500">{a.file}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-zinc-900 dark:text-white">
          核心功能
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} text-white`}
              >
                <feature.icon size={20} />
              </div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 p-8 text-center text-white md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">准备好提升 AI 编码体验了吗？</h2>
        <p className="mx-auto mt-3 max-w-lg text-violet-100">
          免费版即可在本地生成配置文件。升级 Pro 解锁云同步和团队协作。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/scan"
            className="rounded-xl bg-white px-6 py-3 font-medium text-violet-600 shadow-lg transition-all hover:shadow-xl"
          >
            免费开始
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            查看定价
          </Link>
        </div>
      </section>
    </div>
  );
}
