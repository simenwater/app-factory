"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, FileText, BarChart3, Settings } from "lucide-react";

/**
 * @description Bottom navigation bar items
 */
const navItems = [
  { href: "/", icon: Calculator, label: "Calculator" },
  { href: "/reports", icon: FileText, label: "Reports" },
  { href: "/pricing", icon: BarChart3, label: "Pricing" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

/**
 * @description Bottom navigation bar component
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
