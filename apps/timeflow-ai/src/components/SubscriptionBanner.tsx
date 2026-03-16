'use client';

import { Crown, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';

/**
 * 订阅横幅组件
 */
export function SubscriptionBanner() {
  const { user, upgradeToPro } = useStore();

  if (user.subscription === 'pro') {
    return (
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg flex items-center gap-3">
        <Crown className="w-5 h-5" />
        <span className="font-medium">Pro 会员</span>
        <span className="text-sm opacity-90">无限生成</span>
      </div>
    );
  }

  const remainingGenerations = user.generationsLimit - user.generationsUsed;
  const isLimitReached = remainingGenerations <= 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 px-6 py-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              免费版
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isLimitReached ? (
              <span className="text-red-600 dark:text-red-400 font-medium">
                已达到本月生成次数上限
              </span>
            ) : (
              <>
                本月剩余 <span className="font-bold text-blue-600 dark:text-blue-400">{remainingGenerations}</span> 次生成机会
              </>
            )}
          </p>
        </div>

        <button
          onClick={upgradeToPro}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
        >
          升级 Pro - $5/月
        </button>
      </div>

      {!isLimitReached && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
              style={{
                width: `${((user.generationsLimit - remainingGenerations) / user.generationsLimit) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">免费版</p>
          <p className="font-medium text-gray-900 dark:text-white">5次/月</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Pro 订阅</p>
          <p className="font-medium text-gray-900 dark:text-white">无限次</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">本地导出</p>
          <p className="font-medium text-gray-900 dark:text-white">$29 永久</p>
        </div>
      </div>
    </div>
  );
}
