"use client";

/**
 * @fileoverview 订阅横幅组件 — 展示当前套餐及升级提示
 */

import type { SubscriptionState } from "@/types";
import { Crown, Zap } from "lucide-react";

interface SubscriptionBannerProps {
  subscription: SubscriptionState;
  onUpgrade: () => void;
}

/**
 * @param {SubscriptionBannerProps} props
 * @returns {JSX.Element | null} 订阅横幅
 */
export function SubscriptionBanner({ subscription, onUpgrade }: SubscriptionBannerProps) {
  if (subscription.plan !== "free") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white">
        <Crown size={18} />
        <span className="text-sm font-medium">
          Pro Plan — Unlimited syncs &amp; AI features
        </span>
      </div>
    );
  }

  const remaining = subscription.maxFreeSync - subscription.syncCount;

  return (
    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-950/30">
      <div className="flex items-center gap-2">
        <Zap size={18} className="text-amber-600 dark:text-amber-400" />
        <div>
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Free Plan — {remaining} syncs remaining
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Upgrade for unlimited syncs &amp; AI chord analysis
          </p>
        </div>
      </div>
      <button
        onClick={onUpgrade}
        className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
      >
        Upgrade
      </button>
    </div>
  );
}
