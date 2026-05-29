"use client";

import { Moon, Sun, Mic } from "lucide-react";
import { useAppStore } from "@/store";

/**
 * @description 页面头部导航组件
 */
export function Header() {
  const { darkMode, toggleDarkMode, subscription } = useAppStore();

  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              VoiceFlow AI
            </h1>
            <p className="text-xs text-[var(--muted)]">智能语音笔记</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs text-[var(--muted)]">
            {subscription.plan === "free"
              ? `免费版 (${subscription.usedTranscriptions}/${subscription.maxFreeTranscriptions})`
              : subscription.plan === "monthly"
                ? "月度会员"
                : "年度会员"}
          </div>
          <button
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--secondary)] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            aria-label="切换主题"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
