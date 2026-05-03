"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import {
  FileText,
  Sparkles,
  LayoutTemplate,
  BarChart3,
  CreditCard,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: FileText },
  { href: "/editor", label: "Editor", icon: Sparkles },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/ats-score", label: "ATS Score", icon: BarChart3 },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

/**
 * @description 顶部导航栏组件
 */
export function Navbar() {
  const pathname = usePathname();
  const { settings, toggleDarkMode } = useStore();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <FileText size={18} />
          </div>
          <span className="text-lg font-bold text-text dark:text-text-dark">
            ResumeAI <span className="text-primary">Pro</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-primary/5 hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-primary/10 hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark"
          aria-label="Toggle dark mode"
        >
          {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface dark:border-border-dark dark:bg-surface-dark md:hidden">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
                  active
                    ? "text-primary"
                    : "text-text-muted dark:text-text-muted-dark"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
