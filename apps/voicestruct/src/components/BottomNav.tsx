"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, Clock, Settings } from "lucide-react";

/**
 * @description 底部导航栏项定义
 */
const NAV_ITEMS = [
  { href: "/", label: "录音", icon: Mic },
  { href: "/history", label: "历史", icon: Clock },
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
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
                isActive
                  ? "text-primary dark:text-primary-light"
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
