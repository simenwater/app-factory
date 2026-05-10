"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Images, Layers, CreditCard, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/generate", label: "Generate", icon: Camera },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/batch", label: "Batch", icon: Layers },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

/**
 * @description 底部导航栏
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/80 backdrop-blur-lg dark:border-border-dark dark:bg-surface-dark/80">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
