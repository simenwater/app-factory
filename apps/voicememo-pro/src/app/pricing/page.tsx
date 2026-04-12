"use client";

import { useStore } from "@/store/useStore";
import { PRICING_PLANS } from "@/lib/stripe";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

/**
 * @component PricingPage
 * @description 定价页面
 */
export default function PricingPage() {
  const currentTier = useStore((s) => s.settings.subscriptionTier);
  const [loading, setLoading] = useState<string | null>(null);

  /**
   * @function handleSubscribe
   * @description 发起 Stripe Checkout 会话
   */
  const handleSubscribe = async (planId: string, priceId?: string) => {
    if (!priceId) return;
    setLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("支付初始化失败，请稍后重试");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          选择你的方案
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          从免费开始体验，随时升级解锁全部功能
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 transition-all ${
                plan.popular
                  ? "border-violet-500 shadow-lg shadow-violet-500/10"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {plan.name}
                </h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">{plan.period}</span>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <Check className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id, plan.priceId)}
                  disabled={isCurrent || !plan.priceId || loading === plan.id}
                  className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isCurrent
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-500 cursor-default"
                      : plan.popular
                      ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:from-violet-600 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
                      : plan.priceId
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-400 cursor-default"
                  }`}
                >
                  {isCurrent
                    ? "当前方案"
                    : loading === plan.id
                    ? "处理中..."
                    : plan.priceId
                    ? "立即订阅"
                    : "当前方案"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
