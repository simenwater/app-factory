"use client";

/**
 * @fileoverview 底部导航栏组件
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, History, DollarSign, Settings } from "lucide-react";

/** 导航项配置 */
const NAV_ITEMS = [
  { href: "/", label: "分析", icon: Shield },
  { href: "/history", label: "历史", icon: History },
  { href: "/rates", label: "费率", icon: DollarSign },
  { href: "/settings", label: "设置", icon: Settings },
];

/**
 * @component BottomNav
 * @description 固定在页面底部的导航栏
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
