"use client";

/**
 * @fileoverview 订阅状态徽标组件
 */

import { Crown } from "lucide-react";
import { useAppStore } from "@/store";
import { getRemainingAnalyses } from "@/lib/subscription";

/**
 * SubscriptionBadge - 显示当前订阅状态和剩余使用次数
 * @param props.onUpgrade - 点击升级时的回调
 */
export function SubscriptionBadge({ onUpgrade }: { onUpgrade: () => void }) {
  const subscription = useAppStore((s) => s.subscription);
  const remaining = getRemainingAnalyses(subscription);

  return (
    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 dark:from-indigo-900/20 dark:to-purple-900/20">
      <div className="flex items-center gap-2">
        <Crown className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {subscription.plan === "free"
            ? `免费版 · 剩余 ${remaining} 次分析`
            : `${subscription.plan.toUpperCase()} 版 · 无限分析`}
        </span>
      </div>
      {subscription.plan === "free" && (
        <button
          onClick={onUpgrade}
          className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
        >
          升级 Pro
        </button>
      )}
    </div>
  );
}
