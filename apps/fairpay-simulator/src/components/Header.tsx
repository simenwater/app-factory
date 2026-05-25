'use client';

import { useStore } from '@/store/useStore';
import { Moon, Sun, RotateCcw, DollarSign } from 'lucide-react';

/**
 * @description 页面顶部导航栏，包含 Logo、深色模式切换和重置按钮
 */
export default function Header() {
  const { isDarkMode, toggleDarkMode, reset, step } = useStore();

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                FairPay Simulator
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Smart Compensation Planning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={reset}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
