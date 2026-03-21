"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  FileText,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  Briefcase,
  CreditCard,
  Home,
} from "lucide-react";

/**
 * @description 侧边导航栏菜单项
 */
const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/policies", label: "政策监控", icon: FileText },
  { href: "/advisor", label: "AI顾问", icon: MessageSquare },
  { href: "/risk", label: "风险评估", icon: AlertTriangle },
  { href: "/guides", label: "运营指南", icon: BookOpen },
  { href: "/cases", label: "案例库", icon: Briefcase },
  { href: "/pricing", label: "订阅方案", icon: CreditCard },
];

/**
 * @description 侧边导航栏组件
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-navy-900 text-white z-30">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-navy-700">
        <Globe className="w-8 h-8 text-brand-400" />
        <div>
          <h1 className="text-lg font-bold tracking-tight">ChinaCompass</h1>
          <p className="text-xs text-navy-300">全球合规AI助手</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-navy-700 text-white"
                  : "text-navy-300 hover:bg-navy-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-navy-700">
        <div className="bg-navy-800 rounded-lg p-3">
          <p className="text-xs text-navy-300">当前版本</p>
          <p className="text-sm font-medium">基础版（免费）</p>
          <Link
            href="/pricing"
            className="mt-2 block text-center text-xs bg-brand-500 hover:bg-brand-600 text-white py-1.5 rounded-md transition-colors"
          >
            升级专业版
          </Link>
        </div>
      </div>
    </aside>
  );
}
