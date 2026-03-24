"use client";

import { useStore } from "@/store/useStore";
import { Shield, Check, Crown } from "lucide-react";

/**
 * @description 订阅定价页面
 */
export default function PricingPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);

  const plans = [
    {
      tier: "free" as const,
      name: "免费版",
      price: "$0",
      period: "永久免费",
      icon: Shield,
      features: [
        "基础报价单模板",
        "3 个拒绝话术模板",
        "1 个客户期望清单",
        "PDF 导出（含水印）",
      ],
      limitations: ["每月最多 5 份报价", "基础模板库"],
      cta: "当前方案",
      active: settings.subscriptionTier === "free",
    },
    {
      tier: "pro" as const,
      name: "专业版",
      price: "$4.99",
      period: "/月",
      altPrice: "或一次性买断 $29.99",
      icon: Crown,
      features: [
        "无限报价单",
        "全部 7+ 拒绝话术模板",
        "无限客户期望清单",
        "PDF 导出（无水印）",
        "AI 智能定制话术",
        "自定义品牌报价模板",
        "优先客户支持",
      ],
      limitations: [],
      cta: "升级专业版",
      active: settings.subscriptionTier === "pro",
    },
  ];

  /**
   * @description 处理订阅选择（模拟，MVP 阶段不接入真实支付）
   */
  const handleSubscribe = (tier: "free" | "pro") => {
    updateSettings({ subscriptionTier: tier });
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">选择您的方案</h1>
        <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
          保护您的时间和收入，让每次报价都更专业
        </p>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.tier}
            className={`rounded-2xl border-2 p-5 transition-all ${
              plan.active
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border bg-surface dark:border-border-dark dark:bg-surface-dark"
            }`}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`rounded-xl p-2.5 ${
                  plan.active ? "bg-primary text-white" : "bg-bg dark:bg-bg-dark"
                }`}
              >
                <plan.icon size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold">{plan.name}</h2>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  <span className="text-2xl font-bold text-text dark:text-text-dark">
                    {plan.price}
                  </span>
                  {plan.period}
                </p>
                {"altPrice" in plan && plan.altPrice && (
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    {plan.altPrice}
                  </p>
                )}
              </div>
            </div>

            <ul className="mb-4 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check size={16} className="shrink-0 text-success" />
                  {feature}
                </li>
              ))}
              {plan.limitations.map((limit) => (
                <li
                  key={limit}
                  className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark"
                >
                  <span className="shrink-0 text-xs">•</span>
                  {limit}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.tier)}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors ${
                plan.active
                  ? "cursor-default bg-primary/20 text-primary"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {plan.active ? "✓ 当前方案" : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-text-muted dark:text-text-muted-dark">
        MVP 阶段所有功能均可免费体验。正式上线后将接入 Stripe 支付。
      </p>

      <div className="h-8" />
    </div>
  );
}
