'use client';

import { Bot } from 'lucide-react';

/**
 * @description AI 正在输入的加载动画
 */
export default function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-accent-100 dark:bg-accent-900/40 text-accent-600 dark:text-accent-400">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5">
          <span className="typing-dot w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
          <span className="typing-dot w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
          <span className="typing-dot w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
