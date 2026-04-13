"use client";

/**
 * @fileoverview 顶部导航栏组件
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Sun, Moon, FolderSearch, FileText, GitCompare, CreditCard } from "lucide-react";

/** 导航项定义 */
const navItems = [
  { href: "/", label: "首页", icon: FolderSearch },
  { href: "/scan", label: "扫描", icon: FolderSearch },
  { href: "/templates", label: "模板", icon: FileText },
  { href: "/conflicts", label: "冲突", icon: GitCompare },
  { href: "/pricing", label: "定价", icon: CreditCard },
];

/**
 * 顶部导航栏
 * @returns JSX 元素
 */
export default function Navbar() {
  const pathname = usePathname();
  const { toggleTheme, settings } = useStore();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-bold text-sm">
            CS
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            ConfigSync <span className="text-violet-500">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="切换主题"
          >
            {settings.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
            {settings.subscription.plan === "free" ? "Free" : "Pro"}
          </span>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-zinc-500 dark:text-zinc-500"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
