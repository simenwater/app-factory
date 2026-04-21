'use client';

import { useAppStore } from '@/store';
import { Crown, Zap } from 'lucide-react';

/**
 * @description 订阅状态横幅，展示 Freemium 模式升级提示
 */
export default function SubscriptionBanner() {
  const { user } = useAppStore();

  if (user.plan === 'pro') {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-3">
        <Crown className="w-5 h-5 text-amber-500" />
        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Pro 会员 — 无限使用所有功能
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20 border border-brand-200 dark:border-brand-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Zap className="w-5 h-5 text-brand-500" />
        <div>
          <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
            免费版 — 已使用 {user.usageCount}/{user.freeLimit} 次
          </p>
          <p className="text-xs text-brand-600 dark:text-brand-400">
            升级到 Pro 版解锁无限次数和高级定位报告
          </p>
        </div>
      </div>
      <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap">
        <Crown className="w-4 h-4" />
        升级 Pro — $9/月
      </button>
    </div>
  );
}
