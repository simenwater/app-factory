"use client";

/**
 * @fileoverview 订阅定价页面组件
 */

import { Check, Zap } from "lucide-react";
import { useAppStore } from "@/store";
import { PLAN_LIMITS } from "@/lib/subscription";
import { SubscriptionPlan } from "@/types";

/**
 * PricingPage - 订阅计划展示与升级组件
 * @param props.onClose - 关闭回调
 */
export function PricingPage({ onClose }: { onClose: () => void }) {
  const { subscription, upgradePlan } = useAppStore();

  const handleUpgrade = (plan: SubscriptionPlan) => {
    upgradePlan(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
          升级 RateGuard
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">
          解锁无限分析和全部高级功能
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {(Object.entries(PLAN_LIMITS) as [SubscriptionPlan, typeof PLAN_LIMITS.free][]).map(
            ([plan, data]) => (
              <div
                key={plan}
                className={`rounded-xl border p-5 ${
                  plan === "pro"
                    ? "border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold capitalize text-gray-900 dark:text-white">
                    {plan}
                  </h3>
                  <div className="mt-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${data.price}
                    </span>
                    {data.price > 0 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">/月</span>
                    )}
                  </div>
                </div>
                <ul className="mb-5 space-y-2">
                  {data.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={subscription.plan === plan}
                  className={`w-full rounded-lg py-2 text-sm font-medium transition-all ${
                    subscription.plan === plan
                      ? "cursor-default bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      : plan === "pro"
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {subscription.plan === plan ? (
                    "当前计划"
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <Zap className="h-3.5 w-3.5" />
                      {plan === "free" ? "降级" : "升级"}
                    </span>
                  )}
                </button>
              </div>
            )
          )}
        </div>

        <button
          onClick={onClose}
          className="mx-auto mt-6 block text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
