"use client";

import { Moon, Sun, Shield } from "lucide-react";
import { useAppStore } from "@/store";

/**
 * @description 应用头部组件，含 logo 和深色模式切换
 */
export function Header() {
  const { darkMode, toggleDarkMode, subscription } = useAppStore();

  return (
    <header className="border-b border-(--color-border) bg-(--color-surface)">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-primary) flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">PayWall Pal</h1>
            <p className="text-xs text-(--color-muted)">Protect your time. Get paid.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {subscription.plan === "free" && (
            <span className="text-sm text-(--color-muted) bg-(--color-background) px-3 py-1 rounded-full border border-(--color-border)">
              {subscription.freeUsesRemaining}/{subscription.maxFreeUses} free uses left
            </span>
          )}
          {subscription.plan !== "free" && (
            <span className="text-sm text-(--color-success) bg-(--color-background) px-3 py-1 rounded-full border border-(--color-border)">
              ✓ {subscription.plan === "monthly" ? "Pro Monthly" : "Lifetime Pro"}
            </span>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-(--color-background) transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
