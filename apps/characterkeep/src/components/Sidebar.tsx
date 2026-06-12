"use client";

import { useAppStore } from "@/store";
import {
  Users,
  BookOpen,
  Search,
  AlertTriangle,
  Settings,
  Moon,
  Sun,
} from "lucide-react";

/** 侧边栏导航项配置 */
const NAV_ITEMS = [
  { id: "characters" as const, label: "角色管理", icon: Users },
  { id: "events" as const, label: "剧情事件", icon: BookOpen },
  { id: "consistency" as const, label: "一致性检查", icon: Search },
  { id: "conflicts" as const, label: "冲突预警", icon: AlertTriangle },
  { id: "settings" as const, label: "设置", icon: Settings },
];

/**
 * 侧边栏导航组件
 */
export function Sidebar() {
  const { activeTab, setActiveTab, currentProject, darkMode, toggleDarkMode, issues, warnings } =
    useAppStore();

  return (
    <aside
      className="w-64 h-screen flex flex-col border-r shrink-0"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: "var(--accent)" }}
          >
            CK
          </div>
          <div>
            <h1
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              CharacterKeep
            </h1>
            <p
              className="text-xs truncate max-w-[160px]"
              style={{ color: "var(--text-muted)" }}
            >
              {currentProject?.name}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          const badgeCount =
            item.id === "consistency"
              ? issues.filter((i) => i.severity !== "info").length
              : item.id === "conflicts"
                ? warnings.length
                : 0;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: isActive ? "var(--bg-tertiary)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {badgeCount > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: "var(--danger)" }}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div
        className="p-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {darkMode ? "浅色模式" : "深色模式"}
        </button>
      </div>
    </aside>
  );
}
