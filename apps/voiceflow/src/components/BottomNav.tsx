"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, FileText, Settings } from "lucide-react";

/**
 * @description 导航项配置
 */
const navItems = [
  { href: "/", label: "录音", icon: Mic },
  { href: "/notes", label: "笔记", icon: FileText },
  { href: "/settings", label: "设置", icon: Settings },
];

/**
 * @description 底部导航栏组件
 */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
