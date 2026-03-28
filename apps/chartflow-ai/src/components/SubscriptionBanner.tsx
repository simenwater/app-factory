'use client';

import { Crown, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';

/**
 * @description 订阅横幅组件，显示用户当前套餐信息和升级入口
 */
export function SubscriptionBanner() {
  const { user, upgradeToPro } = useStore();

  if (user.subscription === 'pro') {
    return (
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg flex items-center gap-3">
        <Crown className="w-5 h-5" />
        <span className="font-medium">Pro 会员</span>
        <span className="text-sm opacity-90">无限生成 &amp; 导出</span>
      </div>
    );
  }

  const remainingGenerations =
    user.generationsLimit - user.generationsUsed;
  const remainingExports = user.exportsLimit - user.exportsUsed;
  const isGenerationLimitReached = remainingGenerations <= 0;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-indigo-200 dark:border-gray-600 px-6 py-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-gray-900 dark:text-white">
              免费版
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {isGenerationLimitReached ? (
              <span className="text-red-600 dark:text-red-400 font-medium">
                已达到生成次数上限
              </span>
            ) : (
              <>
                剩余{' '}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {remainingGenerations}
                </span>{' '}
                次生成 /{' '}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {remainingExports}
                </span>{' '}
                次导出
              </>
            )}
          </p>
        </div>

        <button
          onClick={upgradeToPro}
          className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg cursor-pointer"
        >
          升级 Pro - $9/月
        </button>
      </div>

      {!isGenerationLimitReached && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-1.5 rounded-full transition-all"
              style={{
                width: `${(user.generationsUsed / user.generationsLimit) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">免费版</p>
          <p className="font-medium text-gray-900 dark:text-white">
            10 次生成/月
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">导出限制</p>
          <p className="font-medium text-gray-900 dark:text-white">
            5 次导出/月
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Pro 订阅</p>
          <p className="font-medium text-gray-900 dark:text-white">
            无限使用
          </p>
        </div>
      </div>
    </div>
  );
}
