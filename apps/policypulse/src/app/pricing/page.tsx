"use client";

import { Check, Sparkles, CreditCard } from "lucide-react";
import { useStore } from "@/store/useStore";
import { subscriptionPlans } from "@/lib/mockData";

/**
 * @component PricingPage
 * 订阅方案页面
 */
export default function PricingPage() {
  const tier = useStore((s) => s.settings.subscriptionTier);
  const setSubscriptionTier = useStore((s) => s.setSubscriptionTier);

  /**
   * 模拟订阅操作（MVP 阶段）
   */
  const handleSubscribe = (planId: string) => {
    if (planId === "free") {
      setSubscriptionTier("free");
    } else {
      setSubscriptionTier("pro");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-blue-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            选择您的方案
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          PolicyPulse 帮助您实时掌握全球政策动向，将复杂的宏观政策翻译为直接影响您业务的简明预警
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const isCurrentPlan =
            (plan.id === "free" && tier === "free") ||
            (plan.id !== "free" && tier === "pro");

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 transition-all ${
                plan.highlighted
                  ? "border-blue-500 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    ${plan.price === 0 ? "0" : plan.price}
                  </span>
                  <span className="text-slate-500 text-sm">
                    /{plan.interval === "month" ? "月" : "年"}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "text-blue-500" : "text-green-500"
                      }`}
                    />
                    <span className="text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isCurrentPlan
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    : plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {isCurrentPlan ? "当前方案" : plan.price === 0 ? "使用免费版" : "立即订阅"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8 text-xs text-slate-400">
        <p>支持随时取消 · 7天无理由退款 · 安全支付</p>
      </div>
    </div>
  );
}
