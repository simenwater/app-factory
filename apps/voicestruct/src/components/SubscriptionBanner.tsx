"use client";

import { Crown } from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * @description 订阅提示横幅，展示免费版剩余次数或提示升级
 */
export function SubscriptionBanner() {
  const subscription = useStore((s) => s.settings.subscription);
  const getRemainingFreeUses = useStore((s) => s.getRemainingFreeUses);

  if (subscription === "pro") return null;

  const remaining = getRemainingFreeUses();

  return (
    <div
      className={`flex items-center justify-between rounded-xl px-4 py-3 ${
        remaining === 0
          ? "bg-red-50 dark:bg-red-950/30"
          : "bg-primary/5 dark:bg-primary/10"
      }`}
    >
      <div className="flex items-center gap-2">
        <Crown
          size={16}
          className={remaining === 0 ? "text-danger" : "text-primary"}
        />
        <span className="text-xs font-medium text-text dark:text-text-dark">
          {remaining === 0
            ? "免费次数已用完"
            : `剩余 ${remaining} 次免费使用`}
        </span>
      </div>
      <a
        href="/settings"
        className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
      >
        升级 Pro
      </a>
    </div>
  );
}
