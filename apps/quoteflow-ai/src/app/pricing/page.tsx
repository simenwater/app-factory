"use client";

import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * @description 订阅定价页面
 */
export default function PricingPage() {
  const router = useRouter();
  const { settings, setSubscription } = useStore();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      tier: "free" as const,
      features: [
        "5 quotes per month",
        "Basic AI quote generation",
        "3 follow-up templates",
        "Client management",
        "Revenue dashboard",
      ],
      limitations: [
        "QuoteFlow branding on PDFs",
        "Limited templates",
      ],
    },
    {
      name: "Pro",
      price: "$9.90",
      period: "per month",
      tier: "pro" as const,
      popular: true,
      features: [
        "Unlimited quotes",
        "Advanced AI with custom pricing rules",
        "Unlimited custom templates",
        "Priority email support",
        "Custom brand on PDFs",
        "Revenue analytics & reports",
        "Automated follow-up scheduling",
        "CSV export",
      ],
      limitations: [],
    },
  ];

  /**
   * @description 处理订阅操作（MVP 模拟）
   */
  const handleSubscribe = (tier: "free" | "pro") => {
    if (tier === "pro" && settings.subscription !== "pro") {
      setSubscription("pro");
      router.push("/");
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">Choose Your Plan</h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          Start free, upgrade when you need more
        </p>
        <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
          14-day free trial on Pro. Cancel anytime.
        </p>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border-2 p-6 transition-shadow ${
              plan.popular
                ? "border-primary shadow-lg shadow-primary/10"
                : "border-border dark:border-border-dark"
            } bg-surface dark:bg-surface-dark`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow">
                  <Sparkles size={12} /> Most Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="text-sm text-text-muted dark:text-text-muted-dark">
                  /{plan.period}
                </span>
              </div>
            </div>

            <ul className="mb-6 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check size={16} className="shrink-0 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
              {plan.limitations.map((limitation) => (
                <li
                  key={limitation}
                  className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark"
                >
                  <span className="ml-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.tier)}
              disabled={settings.subscription === plan.tier}
              className={`w-full rounded-xl py-3 font-semibold transition-opacity ${
                plan.popular
                  ? "bg-primary text-white shadow-lg hover:opacity-90"
                  : "bg-gray-100 text-text dark:bg-gray-800 dark:text-text-dark"
              } disabled:opacity-50`}
            >
              {settings.subscription === plan.tier
                ? "Current Plan"
                : plan.tier === "pro"
                  ? "Start 14-Day Free Trial"
                  : "Downgrade"}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-text-muted dark:text-text-muted-dark">
        Prices in USD. Subscriptions are billed monthly. Cancel anytime from
        Settings.
      </p>
    </div>
  );
}
