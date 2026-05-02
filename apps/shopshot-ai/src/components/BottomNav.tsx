'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clock, CreditCard } from 'lucide-react';

/**
 * @description 底部导航栏
 */
const NAV_ITEMS = [
  { href: '/', icon: Home, label: '生成' },
  { href: '/history', icon: Clock, label: '历史' },
  { href: '/pricing', icon: CreditCard, label: '订阅' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-gray-950/90 border-t border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-around">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                isActive
                  ? 'text-indigo-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
