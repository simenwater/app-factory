"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Building2,
  CreditCard,
  Settings,
} from "lucide-react";

/**
 * 移动端底部导航条目
 */
const navItems = [
  { href: "/", label: "概览", icon: LayoutDashboard },
  { href: "/policies", label: "政策", icon: FileText },
  { href: "/industries", label: "行业", icon: Building2 },
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 md:hidden z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
