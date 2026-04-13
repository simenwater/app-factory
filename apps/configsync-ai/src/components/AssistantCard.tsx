"use client";

/**
 * @fileoverview AI 助手卡片组件
 */

import { AIAssistant } from "@/types";
import { Check } from "lucide-react";

/** AI 助手元数据 */
const ASSISTANT_META: Record<AIAssistant, { name: string; color: string; description: string }> = {
  cursor: {
    name: "Cursor",
    color: "from-blue-500 to-cyan-500",
    description: "生成 .cursorrules 配置文件",
  },
  codex: {
    name: "OpenAI Codex",
    color: "from-green-500 to-emerald-500",
    description: "生成 AGENTS.md 指令文件",
  },
  "claude-code": {
    name: "Claude Code",
    color: "from-orange-500 to-amber-500",
    description: "生成 CLAUDE.md 上下文文件",
  },
  copilot: {
    name: "GitHub Copilot",
    color: "from-purple-500 to-pink-500",
    description: "生成 copilot-instructions.md",
  },
  windsurf: {
    name: "Windsurf",
    color: "from-teal-500 to-sky-500",
    description: "生成 .windsurfrules 配置文件",
  },
};

interface AssistantCardProps {
  assistant: AIAssistant;
  selected: boolean;
  onToggle: () => void;
}

/**
 * AI 助手选择卡片
 * @param props - 组件属性
 * @returns JSX 元素
 */
export default function AssistantCard({ assistant, selected, onToggle }: AssistantCardProps) {
  const meta = ASSISTANT_META[assistant];

  return (
    <button
      onClick={onToggle}
      className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all ${
        selected
          ? "border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/10 dark:border-violet-400 dark:bg-violet-950/20"
          : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
      }`}
    >
      {selected && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white">
          <Check size={12} />
        </div>
      )}
      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center text-white text-xs font-bold`}>
        {meta.name.charAt(0)}
      </div>
      <div>
        <div className="font-semibold text-zinc-900 dark:text-white">{meta.name}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{meta.description}</div>
      </div>
    </button>
  );
}

export { ASSISTANT_META };
