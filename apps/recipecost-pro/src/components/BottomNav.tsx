"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ChefHat, Settings } from "lucide-react";

/**
 * @description 底部导航栏配置项
 */
const navItems = [
  { href: "/", icon: Home, label: "首页" },
  { href: "/ingredients", icon: Package, label: "食材" },
  { href: "/recipes", icon: ChefHat, label: "食谱" },
  { href: "/settings", icon: Settings, label: "设置" },
];

/**
 * @description 底部导航栏组件
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface dark:border-border-dark dark:bg-surface-dark">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted dark:text-text-muted-dark"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
