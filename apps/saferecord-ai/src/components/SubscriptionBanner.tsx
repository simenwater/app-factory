'use client';

/**
 * @fileoverview 订阅引导横幅组件
 * 展示当前订阅状态和升级入口
 */

import { Crown, Zap } from 'lucide-react';
import { useRecordingStore } from '@/store/recordingStore';

/**
 * @description 订阅状态横幅，引导免费用户升级
 */
export function SubscriptionBanner() {
  const subscription = useRecordingStore((s) => s.subscription);

  if (subscription.plan !== 'free') return null;

  const usagePercent = Math.min(
    (subscription.usedMinutes / subscription.totalMinutes) * 100,
    100
  );

  return (
    <div className="mx-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-purple-500" />
          <span className="font-medium text-text dark:text-text-dark text-sm">
            免费版
          </span>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full hover:opacity-90 transition-opacity">
          <Zap className="w-3 h-3" />
          升级 Pro
        </button>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted dark:text-muted-dark mb-1">
          <span>本月转录额度</span>
          <span>
            {subscription.usedMinutes}/{subscription.totalMinutes} 分钟
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-white/50 dark:bg-white/5 rounded-lg text-center">
          <p className="font-bold text-text dark:text-text-dark">$4.99/月</p>
          <p className="text-muted dark:text-muted-dark">无限转录</p>
        </div>
        <div className="p-2 bg-white/50 dark:bg-white/5 rounded-lg text-center">
          <p className="font-bold text-text dark:text-text-dark">$29.99/年</p>
          <p className="text-muted dark:text-muted-dark">省50%</p>
        </div>
      </div>
    </div>
  );
}
