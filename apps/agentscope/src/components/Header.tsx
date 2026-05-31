"use client";

import { useStore } from "@/lib/store";
import { Moon, Sun, Trash2, Radio, Download } from "lucide-react";

/**
 * @description 顶部导航栏组件
 */
export default function Header() {
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const isListening = useStore((s) => s.isListening);
  const clearLogs = useStore((s) => s.clearLogs);
  const logCount = useStore((s) => s.logs.length);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
        darkMode
          ? "border-border bg-bg-primary/80"
          : "border-light-border bg-light-bg-secondary/80"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              AgentScope
            </h1>
            <p
              className={`text-xs ${
                darkMode ? "text-text-muted" : "text-light-text-muted"
              }`}
            >
              AI 编码代理流量监控
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 监听状态 */}
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              isListening
                ? "bg-success/10 text-success"
                : darkMode
                  ? "bg-bg-tertiary text-text-secondary"
                  : "bg-light-bg-tertiary text-light-text-secondary"
            }`}
          >
            <Radio className={`h-3 w-3 ${isListening ? "animate-pulse" : ""}`} />
            {isListening ? "监听中" : "已停止"}
          </div>

          {/* 日志计数 */}
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              darkMode
                ? "bg-bg-tertiary text-text-secondary"
                : "bg-light-bg-tertiary text-light-text-secondary"
            }`}
          >
            {logCount} 条日志
          </span>

          {/* 清空日志 */}
          <button
            onClick={clearLogs}
            className={`rounded-lg p-2 transition-colors ${
              darkMode
                ? "text-text-secondary hover:bg-bg-tertiary hover:text-error"
                : "text-light-text-secondary hover:bg-light-bg-tertiary hover:text-error"
            }`}
            title="清空日志"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* 深色模式切换 */}
          <button
            onClick={toggleDarkMode}
            className={`rounded-lg p-2 transition-colors ${
              darkMode
                ? "text-text-secondary hover:bg-bg-tertiary hover:text-accent"
                : "text-light-text-secondary hover:bg-light-bg-tertiary hover:text-accent"
            }`}
            title={darkMode ? "切换到亮色模式" : "切换到深色模式"}
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
