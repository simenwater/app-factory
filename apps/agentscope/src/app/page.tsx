"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { generateMockLogs } from "@/lib/mock-data";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCards";
import ModelBreakdown from "@/components/ModelBreakdown";
import AgentList from "@/components/AgentList";
import LogFilter from "@/components/LogFilter";
import LogTable from "@/components/LogTable";
import PricingSection from "@/components/PricingSection";
import { Database, Sparkles } from "lucide-react";

/**
 * @description 主页面 - 包含仪表盘、日志列表和定价区域
 */
export default function HomePage() {
  const darkMode = useStore((s) => s.darkMode);
  const addLogs = useStore((s) => s.addLogs);
  const logCount = useStore((s) => s.logs.length);
  const [activeView, setActiveView] = useState<"dashboard" | "pricing">(
    "dashboard"
  );
  const [loading, setLoading] = useState(false);

  const loadDemoData = () => {
    setLoading(true);
    setTimeout(() => {
      const logs = generateMockLogs(50);
      addLogs(logs);
      setLoading(false);
    }, 500);
  };

  return (
    <div className={darkMode ? "dark" : "light"}>
      <Header />

      <main className="mx-auto max-w-screen-2xl px-6 py-6">
        {/* 导航 Tab */}
        <div className="mb-6 flex items-center justify-between">
          <div
            className={`flex gap-1 rounded-lg border p-1 ${
              darkMode ? "border-border bg-bg-secondary" : "border-light-border bg-light-bg-tertiary"
            }`}
          >
            <button
              onClick={() => setActiveView("dashboard")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                activeView === "dashboard"
                  ? "bg-accent text-white"
                  : darkMode
                    ? "text-text-secondary hover:text-text-primary"
                    : "text-light-text-secondary hover:text-light-text-primary"
              }`}
            >
              <Database className="mr-1.5 inline h-3.5 w-3.5" />
              仪表盘
            </button>
            <button
              onClick={() => setActiveView("pricing")}
              className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
                activeView === "pricing"
                  ? "bg-accent text-white"
                  : darkMode
                    ? "text-text-secondary hover:text-text-primary"
                    : "text-light-text-secondary hover:text-light-text-primary"
              }`}
            >
              <Sparkles className="mr-1.5 inline h-3.5 w-3.5" />
              升级
            </button>
          </div>

          {activeView === "dashboard" && logCount === 0 && (
            <button
              onClick={loadDemoData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              加载演示数据
            </button>
          )}
        </div>

        {activeView === "dashboard" ? (
          <div className="space-y-6">
            {/* 统计卡片 */}
            <StatsCards />

            {/* 模型统计 + 代理列表 */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ModelBreakdown />
              </div>
              <AgentList />
            </div>

            {/* 日志筛选 */}
            <LogFilter />

            {/* 日志列表 */}
            <LogTable />
          </div>
        ) : (
          <PricingSection />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`mt-12 border-t py-6 text-center text-xs ${
          darkMode
            ? "border-border text-text-muted"
            : "border-light-border text-light-text-muted"
        }`}
      >
        <p>AgentScope v0.1.0 — AI 编码代理流量监控工具</p>
        <p className="mt-1">
          代理服务器默认运行在 localhost:8787 · 将 AI 代理的 API Base URL
          指向代理服务器即可开始监控
        </p>
      </footer>
    </div>
  );
}
