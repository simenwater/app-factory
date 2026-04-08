"use client";

import { useStore } from "@/store/useStore";
import { RepoInput } from "@/components/RepoInput";
import { FormatSelector } from "@/components/FormatSelector";
import { OptionsPanel } from "@/components/OptionsPanel";
import { RepoSummary } from "@/components/RepoSummary";
import { GenerateButton } from "@/components/GenerateButton";
import { ResultPreview } from "@/components/ResultPreview";
import { Zap, GitBranch, FileCode, Download } from "lucide-react";

/**
 * @description 首页步骤说明
 */
const STEPS = [
  {
    icon: GitBranch,
    title: "输入仓库",
    desc: "粘贴 GitHub 仓库 URL",
  },
  {
    icon: Zap,
    title: "AI 分析",
    desc: "自动分析项目结构和技术栈",
  },
  {
    icon: FileCode,
    title: "选择格式",
    desc: "Cursor / Copilot / Claude",
  },
  {
    icon: Download,
    title: "导出文件",
    desc: "一键下载配置文件",
  },
];

/**
 * @description 应用首页
 */
export default function HomePage() {
  const repoInfo = useStore((s) => s.repoInfo);
  const result = useStore((s) => s.result);
  const error = useStore((s) => s.error);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="pt-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-text dark:text-text-dark sm:text-4xl">
          让 AI 助手
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {" "}真正理解{" "}
          </span>
          你的代码
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-text-muted dark:text-text-muted-dark">
          一键分析 GitHub 仓库，自动生成 AGENTS.md / .cursorrules / CLAUDE.md
          配置文件，让 AI 编码助手更高效地理解项目上下文。
        </p>
      </section>

      {/* Steps */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="flex flex-col items-center rounded-xl border border-border bg-surface p-4 text-center dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <step.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xs font-bold text-text-muted dark:text-text-muted-dark">
              Step {i + 1}
            </div>
            <div className="mt-0.5 text-sm font-semibold text-text dark:text-text-dark">
              {step.title}
            </div>
            <div className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
              {step.desc}
            </div>
          </div>
        ))}
      </section>

      {/* Main workspace */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <RepoInput />

          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
              {error}
            </div>
          )}

          {repoInfo && <RepoSummary />}
        </div>

        <div className="space-y-6">
          <FormatSelector />
          <OptionsPanel />
        </div>
      </section>

      <GenerateButton />

      {result && (
        <section>
          <ResultPreview />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border pt-6 text-center text-xs text-text-muted dark:border-border-dark dark:text-text-muted-dark">
        AgentConfig Pro &copy; {new Date().getFullYear()} — AI 编码助手配置文件生成器
      </footer>
    </div>
  );
}
