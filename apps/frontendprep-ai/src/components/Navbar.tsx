'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Code2, BarChart3, CreditCard, Home } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useStore } from '@/store/useStore';

const NAV_ITEMS = [
  { href: '/', label: '首页', icon: Home },
  { href: '/interview', label: '模拟面试', icon: MessageSquare },
  { href: '/review', label: '代码评估', icon: Code2 },
  { href: '/plan', label: '练习计划', icon: BarChart3 },
  { href: '/pricing', label: '订阅', icon: CreditCard },
];

/**
 * @description 顶部导航栏，包含页面导航、用户状态和主题切换
 */
export default function Navbar() {
  const pathname = usePathname();
  const { user } = useStore();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-brand-600 dark:text-brand-400">FP</span>
              <span className="hidden sm:inline">FrontendPrep AI</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.subscription === 'free' && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                免费 {user.interviewCount}/{user.maxFreeInterviews}
              </span>
            )}
            {user.subscription !== 'free' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 font-medium">
                {user.subscription === 'pro' ? 'PRO' : 'SPRINT'}
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
