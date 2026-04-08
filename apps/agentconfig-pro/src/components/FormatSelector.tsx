"use client";

import { useStore } from "@/store/useStore";
import type { AgentFormat } from "@/types";

/**
 * @description AI 助手格式配置
 */
const FORMAT_OPTIONS: {
  id: AgentFormat;
  label: string;
  desc: string;
  filename: string;
}[] = [
  {
    id: "cursor",
    label: "Cursor",
    desc: "Cursor AI 编辑器专用规则文件",
    filename: ".cursorrules",
  },
  {
    id: "github-copilot",
    label: "GitHub Copilot",
    desc: "Copilot 自定义指令文件",
    filename: ".github/copilot-instructions.md",
  },
  {
    id: "claude",
    label: "Claude Code",
    desc: "Claude Code 项目上下文文件",
    filename: "CLAUDE.md",
  },
  {
    id: "generic",
    label: "通用 AGENTS.md",
    desc: "适用于所有 AI 编码助手的通用格式",
    filename: "AGENTS.md",
  },
];

/**
 * @description 导出格式选择器组件
 */
export function FormatSelector() {
  const format = useStore((s) => s.format);
  const setFormat = useStore((s) => s.setFormat);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text dark:text-text-dark">
        选择导出格式
      </label>
      <div className="grid grid-cols-2 gap-3">
        {FORMAT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFormat(opt.id)}
            className={`rounded-xl border-2 p-3 text-left transition-all ${
              format === opt.id
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10 dark:bg-primary/10"
                : "border-border hover:border-primary/30 dark:border-border-dark dark:hover:border-primary/30"
            }`}
          >
            <div className="text-sm font-semibold text-text dark:text-text-dark">
              {opt.label}
            </div>
            <div className="mt-0.5 text-xs text-text-muted dark:text-text-muted-dark">
              {opt.desc}
            </div>
            <code className="mt-1.5 inline-block rounded bg-border/40 px-1.5 py-0.5 text-[10px] text-text-muted dark:bg-border-dark/40 dark:text-text-muted-dark">
              {opt.filename}
            </code>
          </button>
        ))}
      </div>
    </div>
  );
}
