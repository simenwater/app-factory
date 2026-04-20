'use client';

import { Mic, Moon, Sun, CreditCard, History, Settings } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';

/**
 * @description 顶部导航栏组件
 */
export default function Header() {
  const { theme, toggleTheme, user } = useStore();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            VoiceFlow AI
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {user.subscription === 'free' && (
            <span className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full mr-2">
              {user.usageLimit - user.usageCount} 次剩余
            </span>
          )}

          <Link
            href="/history"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="历史记录"
          >
            <History className="w-5 h-5" />
          </Link>

          <Link
            href="/pricing"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="升级订阅"
          >
            <CreditCard className="w-5 h-5" />
          </Link>

          <Link
            href="/settings"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="设置"
          >
            <Settings className="w-5 h-5" />
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="切换主题"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
