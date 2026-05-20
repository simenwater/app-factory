"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Mail, Settings } from "lucide-react";

/**
 * @description 底部导航栏项目配置
 */
const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quotes", label: "Quotes", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/follow-ups", label: "Follow-ups", icon: Mail },
  { href: "/settings", label: "Settings", icon: Settings },
];

/**
 * @description 底部导航栏组件
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/95">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted dark:text-text-muted-dark"
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
