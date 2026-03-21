"use client";

/**
 * @description 侧边导航栏组件
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  FolderKanban,
  FileText,
  Receipt,
  TrendingUp,
  CreditCard,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/", label: "仪表盘", icon: TrendingUp },
  { href: "/clients", label: "客户管理", icon: Users },
  { href: "/projects", label: "项目看板", icon: FolderKanban },
  { href: "/quotes", label: "报价单", icon: FileText },
  { href: "/invoices", label: "发票", icon: Receipt },
  { href: "/finance", label: "财务面板", icon: TrendingUp },
  { href: "/pricing", label: "升级计划", icon: CreditCard },
];

/**
 * @description 侧边栏导航
 */
export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-surface p-2 shadow-lg dark:bg-surface-dark lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-text dark:text-text-dark" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar dark:bg-sidebar-dark transition-transform duration-200",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Zap className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-text dark:text-text-dark">SoloFlow</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-text-muted dark:text-text-muted-dark" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
                    : "text-text-muted hover:bg-border/50 hover:text-text dark:text-text-muted-dark dark:hover:bg-border-dark/50 dark:hover:text-text-dark"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-6 py-4 dark:border-border-dark">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
