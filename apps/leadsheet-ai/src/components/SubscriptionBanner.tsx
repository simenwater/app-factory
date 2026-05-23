"use client";

/**
 * @fileoverview 订阅引导横幅组件
 */

import { Sparkles, Crown } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { SubscriptionPlan } from "@/types";

/** 订阅计划配置 */
const PLANS: SubscriptionPlan[] = [
  {
    tier: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["每月 5 次 AI 生成", "基础伴奏播放", "本地存储"],
    generationsPerMonth: 5,
  },
  {
    tier: "pro",
    name: "Pro",
    priceMonthly: 9.99,
    priceYearly: 49.99,
    features: ["每月 100 次 AI 生成", "全部伴奏风格", "导出 PDF/MusicXML", "云同步"],
    generationsPerMonth: 100,
  },
  {
    tier: "premium",
    name: "Premium",
    priceMonthly: 19.99,
    priceYearly: 99.99,
    features: ["无限 AI 生成", "全部功能", "优先支持", "API 访问"],
    generationsPerMonth: Infinity,
  },
];

/**
 * @description 订阅引导横幅
 */
export function SubscriptionBanner() {
  const subscription = useStore((s) => s.settings.subscription);
  const generationsThisMonth = useStore((s) => s.generationsThisMonth);
  const updateSettings = useStore((s) => s.updateSettings);

  if (subscription !== "free") return null;

  const currentPlan = PLANS.find((p) => p.tier === subscription)!;
  const remaining = currentPlan.generationsPerMonth - generationsThisMonth;

  return (
    <div className="mx-4 mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 p-4 text-white shadow-lg">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white/20 p-2">
          <Crown size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">升级到 Pro</h3>
          <p className="mt-0.5 text-sm text-white/80">
            本月剩余 {Math.max(0, remaining)} 次免费生成。升级解锁更多功能。
          </p>
          <button
            onClick={() => updateSettings({ subscription: "pro" })}
            className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles size={14} className="mr-1 inline" />
            $9.99/月 升级
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * @description 订阅计划选择组件（用于设置页面）
 */
export function SubscriptionPlans() {
  const currentTier = useStore((s) => s.settings.subscription);
  const updateSettings = useStore((s) => s.updateSettings);

  return (
    <div className="space-y-3">
      {PLANS.map((plan) => {
        const isCurrent = plan.tier === currentTier;
        return (
          <div
            key={plan.tier}
            className={`rounded-2xl border-2 p-4 transition-all ${
              isCurrent
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 dark:border-border-dark"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-text dark:text-text-dark">
                  {plan.name}
                </h4>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  {plan.priceMonthly === 0
                    ? "免费"
                    : `$${plan.priceMonthly}/月 或 $${plan.priceYearly}/年`}
                </p>
              </div>
              {isCurrent ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  当前方案
                </span>
              ) : (
                <button
                  onClick={() => updateSettings({ subscription: plan.tier })}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
                >
                  选择
                </button>
              )}
            </div>
            <ul className="mt-3 space-y-1">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="text-sm text-text-muted dark:text-text-muted-dark"
                >
                  ✓ {f}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
