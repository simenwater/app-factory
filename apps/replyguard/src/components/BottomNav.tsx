"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BarChart3, CreditCard, Settings } from "lucide-react";

/**
 * @description 导航项配置
 */
const NAV_ITEMS = [
  { href: "/", label: "首页", icon: Home },
  { href: "/analyze", label: "分析", icon: Search },
  { href: "/tracking", label: "追踪", icon: BarChart3 },
  { href: "/pricing", label: "订阅", icon: CreditCard },
  { href: "/settings", label: "设置", icon: Settings },
];

/**
 * @description 底部导航栏组件
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface dark:border-border-dark dark:bg-surface-dark">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted dark:text-text-muted-dark"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
