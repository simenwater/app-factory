"use client";

import { useStore } from "@/store/useStore";
import { Moon, Sun, Zap } from "lucide-react";

/**
 * @description 应用头部导航栏
 */
export function Header() {
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text dark:text-text-dark">
              AgentConfig Pro
            </h1>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              AI 编码助手配置文件生成器
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/pricing"
            className="text-sm font-medium text-text-muted hover:text-primary dark:text-text-muted-dark dark:hover:text-primary-light"
          >
            定价
          </a>
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-border/50 dark:text-text-muted-dark dark:hover:bg-border-dark/50"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
