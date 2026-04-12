"use client";

import { Mic, History, CreditCard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * @component MobileNav
 * @description 移动端底部导航栏
 */
export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "录音", icon: Mic },
    { href: "/history", label: "历史", icon: History },
    { href: "/pricing", label: "定价", icon: CreditCard },
    { href: "/settings", label: "设置", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
      <div className="flex justify-around items-center h-16 px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
