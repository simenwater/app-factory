"use client";

import { useStore } from "@/store/useStore";
import { Moon, Sun, Monitor, Shield } from "lucide-react";
import type { Theme } from "@/types";

/**
 * @description 顶部导航栏，包含 logo、主题切换、订阅状态
 */
export default function Header() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const plan = useStore((s) => s.plan);

  const themeOptions: { value: Theme; icon: React.ReactNode; label: string }[] =
    [
      { value: "light", icon: <Sun size={16} />, label: "浅色" },
      { value: "dark", icon: <Moon size={16} />, label: "深色" },
      { value: "system", icon: <Monitor size={16} />, label: "跟随系统" },
    ];

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-bg) 80%, transparent)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">PrivPDF</h1>
            <p
              className="text-xs leading-tight"
              style={{ color: "var(--color-text-muted)" }}
            >
              隐私优先 · 本地运行
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {plan === "free" && (
            <button
              onClick={() => useStore.getState().setPlan("pro")}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-white"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              升级 Pro
            </button>
          )}

          {plan !== "free" && (
            <span
              className="rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                backgroundColor: "var(--color-primary-light)",
                color: "var(--color-primary)",
              }}
            >
              {plan === "pro" ? "Pro 版" : "终身版"}
            </span>
          )}

          <div
            className="flex rounded-lg p-0.5"
            style={{ backgroundColor: "var(--color-bg-tertiary)" }}
          >
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className="rounded-md p-1.5"
                style={{
                  backgroundColor:
                    theme === opt.value
                      ? "var(--color-bg)"
                      : "transparent",
                  color:
                    theme === opt.value
                      ? "var(--color-text)"
                      : "var(--color-text-muted)",
                }}
                title={opt.label}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
