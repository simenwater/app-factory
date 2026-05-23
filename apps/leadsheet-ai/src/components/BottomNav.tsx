"use client";

/**
 * @fileoverview 底部导航栏组件
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Library, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "首页" },
  { href: "/generate", icon: Sparkles, label: "生成" },
  { href: "/library", icon: Library, label: "乐谱库" },
  { href: "/settings", icon: Settings, label: "设置" },
];

/**
 * @description 底部导航栏
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/80 backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark/80">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={isActive ? "font-semibold" : "font-normal"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
