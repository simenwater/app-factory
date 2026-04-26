'use client';

import { Moon, Sun } from 'lucide-react';
import { useStore } from '@/store/useStore';

/**
 * @description 深色/浅色模式切换按钮
 */
export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
      aria-label={darkMode ? '切换到浅色模式' : '切换到深色模式'}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}
