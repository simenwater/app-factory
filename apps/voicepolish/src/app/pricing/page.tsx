"use client";

import { Check, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { PLANS } from "@/lib/stripe";

/**
 * @page PricingPage
 * 订阅方案页面
 */
export default function PricingPage() {
  const currentTier = useStore((s) => s.settings.subscriptionTier);

  /**
   * @function handleSubscribe
   * 发起 Stripe Checkout 订阅
   */
  const handleSubscribe = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("创建支付会话失败，请重试");
    }
  };

  const plans = [
    {
      key: "free" as const,
      ...PLANS.free,
      highlighted: false,
    },
    {
      key: "pro" as const,
      ...PLANS.pro,
      highlighted: true,
    },
  ];

  return (
    <div className="px-4 md:px-8 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          选择适合你的方案
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          免费开始，随时升级
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = currentTier === plan.key;

          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl border p-6 ${
                plan.highlighted
                  ? "border-violet-500 bg-white dark:bg-slate-800 shadow-lg ring-2 ring-violet-500/20"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  推荐
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      /月
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    每月 {plan.minutesLimit} 分钟转录
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.key === "free" ? (
                  <div className="pt-2">
                    <button
                      disabled
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isCurrent
                          ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {isCurrent ? "当前方案" : "免费方案"}
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      onClick={handleSubscribe}
                      disabled={isCurrent}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isCurrent
                          ? "bg-violet-100 dark:bg-violet-900 text-violet-500 dark:text-violet-300"
                          : "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {isCurrent ? "当前方案" : "升级到 Pro"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
