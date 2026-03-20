"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Menu,
  X,
  FileText,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  Briefcase,
  CreditCard,
  Home,
} from "lucide-react";

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
 * @description 移动端导航栏组件
 */
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-navy-900 text-white">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-brand-400" />
          <span className="font-bold">ChinaCompass</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-navy-800"
          aria-label={isOpen ? "关闭菜单" : "打开菜单"}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-30 pt-14 bg-navy-900/95 backdrop-blur-sm">
          <nav className="px-4 py-4 space-y-1">
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
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-navy-700 text-white"
                      : "text-navy-300 hover:bg-navy-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
