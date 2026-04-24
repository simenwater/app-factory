"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, History, CreditCard, Settings } from "lucide-react";

/**
 * @constant MOBILE_NAV_ITEMS
 * 移动端底部导航项
 */
const MOBILE_NAV_ITEMS = [
  { href: "/", label: "录音", icon: Mic },
  { href: "/history", label: "历史", icon: History },
  { href: "/pricing", label: "订阅", icon: CreditCard },
  { href: "/settings", label: "设置", icon: Settings },
];

/**
 * @component MobileNav
 * 移动端底部导航栏
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 safe-area-bottom">
      <div className="flex justify-around items-center py-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
