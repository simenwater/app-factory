"use client";

import { useStore } from "@/store/useStore";
import { getUsagePercentage } from "@/lib/utils";
import { Zap } from "lucide-react";
import Link from "next/link";

/**
 * @component UsageBanner
 * @description 使用额度显示横幅
 */
export function UsageBanner() {
  const settings = useStore((s) => s.settings);
  const pct = getUsagePercentage(
    settings.monthlyMinutesUsed,
    settings.monthlyMinutesLimit
  );

  if (settings.subscriptionTier === "lifetime") return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            本月额度
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {settings.monthlyMinutesUsed} / {settings.monthlyMinutesLimit} 分钟
        </span>
      </div>

      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            pct >= 90
              ? "bg-red-500"
              : pct >= 70
              ? "bg-amber-500"
              : "bg-gradient-to-r from-violet-500 to-indigo-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {settings.subscriptionTier === "free" && pct >= 50 && (
        <Link
          href="/pricing"
          className="block text-xs text-center text-violet-600 dark:text-violet-400 hover:underline"
        >
          升级到专业版，获取 500 分钟/月 →
        </Link>
      )}
    </div>
  );
}
