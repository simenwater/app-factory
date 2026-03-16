"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CalendarDays,
  FileText,
  Settings,
  Home,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/invoices", icon: FileText, label: "Invoices" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

/**
 * @description 移动端底部导航栏
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface dark:border-border-dark dark:bg-surface-dark safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-text-muted dark:text-text-muted-dark"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
