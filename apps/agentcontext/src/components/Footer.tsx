/**
 * @fileoverview 页脚组件
 */

import { Bot } from 'lucide-react';

/**
 * 网站页脚
 * @returns {JSX.Element}
 */
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              AgentContext
            </span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AgentContext. AI 驱动的代理配置生成工具。
          </p>

          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              隐私政策
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              服务条款
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
