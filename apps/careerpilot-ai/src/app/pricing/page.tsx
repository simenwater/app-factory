/**
 * @fileoverview 订阅定价页面 — 免费/月付/季付订阅方案
 */
"use client";

import { useStore } from "@/store/useStore";
import type { SubscriptionPlan } from "@/types";
import { Check, Crown, Zap, Sparkles } from "lucide-react";

/** 定价方案配置 */
const PLANS: {
  id: SubscriptionPlan;
  name: string;
  price: string;
  period: string;
  icon: typeof Zap;
  features: string[];
  popular?: boolean;
}[] = [
  {
    id: "free",
    name: "Free Trial",
    price: "$0",
    period: "",
    icon: Zap,
    features: [
      "3 resume optimizations",
      "3 JD match analyses",
      "Application tracker (unlimited)",
      "Basic skill detection",
    ],
  },
  {
    id: "monthly",
    name: "Pro Monthly",
    price: "$9.9",
    period: "/month",
    icon: Sparkles,
    popular: true,
    features: [
      "Unlimited resume optimizations",
      "Unlimited JD match analyses",
      "AI-powered cover letter generation",
      "Advanced keyword analysis",
      "Application tracker (unlimited)",
      "Priority support",
    ],
  },
  {
    id: "quarterly",
    name: "Pro Quarterly",
    price: "$49",
    period: "/quarter",
    icon: Crown,
    features: [
      "Everything in Pro Monthly",
      "Save 33% vs monthly",
      "Interview prep tips",
      "Salary insights",
      "Resume A/B testing",
      "Early access to new features",
    ],
  },
];

/**
 * @returns 定价页面
 */
export default function PricingPage() {
  const quota = useStore((s) => s.quota);
  const upgradePlan = useStore((s) => s.upgradePlan);

  /** 处理订阅升级（演示模式） */
  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (plan === quota.plan) return;
    upgradePlan(plan);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Simple, Transparent Pricing</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
          Start free, upgrade when you need unlimited power for your job search
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = quota.plan === plan.id;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 bg-white dark:bg-gray-900 p-6 transition-all ${
                plan.popular
                  ? "border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.popular
                    ? "bg-indigo-100 dark:bg-indigo-900/30"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}>
                  <Icon className={`w-5 h-5 ${plan.popular ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-gray-400"}`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-default"
                    : plan.popular
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {isCurrent ? "Current Plan" : plan.id === "free" ? "Downgrade" : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-400 dark:text-gray-500 max-w-md mx-auto">
        <p>
          This is a demo subscription system. In production, integrate with Stripe
          for secure payment processing.
        </p>
      </div>
    </div>
  );
}
