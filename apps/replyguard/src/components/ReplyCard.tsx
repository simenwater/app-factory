"use client";

import type { ReplyDraft, ReplyStyle } from "@/types";
import { Check, Copy, Heart, Sword, MessageCircle } from "lucide-react";
import { useState } from "react";

/**
 * @description 回复风格对应的图标和标签
 */
const STYLE_CONFIG: Record<ReplyStyle, { icon: typeof Heart; label: string; color: string }> = {
  apology: { icon: Heart, label: "诚恳道歉", color: "text-pink-500" },
  explanation: { icon: MessageCircle, label: "专业解释", color: "text-blue-500" },
  counter: { icon: Sword, label: "有力反驳", color: "text-orange-500" },
};

/**
 * @description 单条回复草稿卡片
 */
export function ReplyCard({
  reply,
  isSelected,
  onSelect,
}: {
  reply: ReplyDraft;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const config = STYLE_CONFIG[reply.style];
  const Icon = config.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reply.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border dark:border-border-dark"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={18} className={config.color} />
          <span className="text-sm font-medium text-text dark:text-text-dark">
            {config.label}
          </span>
        </div>
        <span className="text-xs text-text-muted dark:text-text-muted-dark">
          {reply.tone}
        </span>
      </div>

      <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-text dark:text-text-dark">
        {reply.content}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onSelect}
          className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            isSelected
              ? "bg-primary text-white"
              : "bg-surface text-text-muted hover:bg-primary/10 hover:text-primary dark:bg-surface-dark dark:text-text-muted-dark"
          }`}
        >
          <Check size={14} />
          {isSelected ? "已选择" : "选择此回复"}
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-lg bg-surface px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-primary/10 hover:text-primary dark:bg-surface-dark dark:text-text-muted-dark"
        >
          <Copy size={14} />
          {copied ? "已复制!" : "复制"}
        </button>
      </div>
    </div>
  );
}
