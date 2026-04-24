"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * @component SubscriptionBanner
 * 免费用户升级提示横幅
 */
export function SubscriptionBanner() {
  const tier = useStore((s) => s.settings.subscriptionTier);

  if (tier === "pro") return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Link
        href="/pricing"
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 dark:from-violet-500/20 dark:to-indigo-500/20 border border-violet-200 dark:border-violet-800 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
      >
        <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
            升级到 Pro，解锁全部格式
          </p>
          <p className="text-xs text-violet-500 dark:text-violet-400">
            每月仅需 $5 · 600 分钟转录 · 全格式导出
          </p>
        </div>
      </Link>
    </div>
  );
}
