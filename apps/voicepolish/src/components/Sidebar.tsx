"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, History, CreditCard, Settings, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

/**
 * @constant NAV_ITEMS
 * 侧边栏导航项配置
 */
const NAV_ITEMS = [
  { href: "/", label: "录音", icon: Mic },
  { href: "/history", label: "历史记录", icon: History },
  { href: "/pricing", label: "订阅方案", icon: CreditCard },
  { href: "/settings", label: "设置", icon: Settings },
];

/**
 * @component Sidebar
 * 桌面端侧边栏导航
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900 dark:text-white">
            VoicePolish
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            语音笔记润色工具
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400">v0.1.0</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
