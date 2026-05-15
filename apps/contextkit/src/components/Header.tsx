"use client";

import { FileCode2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

/**
 * @param props - 导航配置
 * @param props.activeTab - 当前活跃标签
 * @param props.onTabChange - 标签切换回调
 * @returns Header 组件
 */
export default function Header({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const tabs = [
    { id: "templates", label: "模板库" },
    { id: "editor", label: "编辑器" },
    { id: "sync", label: "同步管理" },
    { id: "pricing", label: "定价" },
  ];

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-primary) 85%, transparent)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: "var(--accent-light)" }}
            >
              <FileCode2 size={22} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                ContextKit
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                AI 代理配置管理器
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor:
                    activeTab === tab.id ? "var(--accent-light)" : "transparent",
                  color:
                    activeTab === tab.id
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "var(--accent)" }}
            >
              登录
            </button>
          </div>
        </div>

        {/* 移动端导航 */}
        <nav className="flex md:hidden overflow-x-auto gap-1 pb-3 -mx-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                backgroundColor:
                  activeTab === tab.id ? "var(--accent-light)" : "transparent",
                color:
                  activeTab === tab.id
                    ? "var(--accent)"
                    : "var(--text-secondary)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
