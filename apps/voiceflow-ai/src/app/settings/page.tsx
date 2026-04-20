'use client';

import { Moon, Sun, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { useStore } from '@/store/useStore';

/**
 * @description 设置页面
 */
export default function SettingsPage() {
  const { theme, toggleTheme, user, notes } = useStore();

  /**
   * @description 清除所有数据
   */
  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
      localStorage.removeItem('voiceflow-storage');
      window.location.reload();
    }
  };

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">设置</h1>

        <div className="space-y-4">
          {/* 账户信息 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <h2 className="font-semibold mb-3">账户信息</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">订阅状态</span>
                <span className="capitalize font-medium">
                  {user.subscription === 'free' ? '免费版' : user.subscription === 'monthly' ? '月度订阅' : '终身会员'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">已使用次数</span>
                <span>{user.usageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">笔记总数</span>
                <span>{notes.length}</span>
              </div>
            </div>
          </div>

          {/* 外观设置 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <h2 className="font-semibold mb-3">外观</h2>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-sm">深色模式</span>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  theme === 'dark' ? 'bg-violet-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* 数据管理 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <h2 className="font-semibold mb-3">数据管理</h2>
            <button
              onClick={handleClearData}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              清除所有数据
            </button>
          </div>

          {/* 关于 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <h2 className="font-semibold mb-3">关于</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>VoiceFlow AI v0.1.0</p>
              <p>利用 AI 为语音笔记进行智能整理、重写和格式化</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
