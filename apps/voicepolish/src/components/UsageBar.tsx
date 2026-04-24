"use client";

import { useStore } from "@/store/useStore";

/**
 * @component UsageBar
 * 用量进度条，显示本月已使用/总额度
 */
export function UsageBar() {
  const settings = useStore((s) => s.settings);
  const { monthlyMinutesUsed, monthlyMinutesLimit } = settings;
  const percentage = Math.min(
    (monthlyMinutesUsed / monthlyMinutesLimit) * 100,
    100
  );
  const isNearLimit = percentage >= 80;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          本月用量
        </span>
        <span
          className={`text-xs font-medium ${
            isNearLimit
              ? "text-amber-600 dark:text-amber-400"
              : "text-slate-600 dark:text-slate-300"
          }`}
        >
          {monthlyMinutesUsed} / {monthlyMinutesLimit} 分钟
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isNearLimit
              ? "bg-gradient-to-r from-amber-400 to-red-500"
              : "bg-gradient-to-r from-violet-500 to-indigo-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
