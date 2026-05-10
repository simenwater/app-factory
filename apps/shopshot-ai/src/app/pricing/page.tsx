"use client";

import { ArrowLeft, Check, Zap, Crown, Rocket } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import type { SubscriptionPlan, SubscriptionTier } from "@/types";

const PLANS: SubscriptionPlan[] = [
  {
    tier: "free",
    name: "Free Trial",
    price: 0,
    imageLimit: 3,
    features: [
      "3 images per month",
      "Basic scenes",
      "Standard quality",
      "Watermarked exports",
    ],
  },
  {
    tier: "starter",
    name: "Starter",
    price: 9.9,
    imageLimit: 50,
    features: [
      "50 images per month",
      "All scenes & angles",
      "HD quality exports",
      "No watermarks",
      "Shopify format export",
      "Email support",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    price: 19.9,
    imageLimit: -1,
    features: [
      "Unlimited images",
      "All scenes & angles",
      "Ultra HD quality",
      "No watermarks",
      "Shopify + Amazon export",
      "Batch processing",
      "Priority support",
      "Custom scenes (coming soon)",
    ],
  },
];

const TIER_ICONS: Record<SubscriptionTier, React.ReactNode> = {
  free: <Zap size={24} className="text-text-muted" />,
  starter: <Rocket size={24} className="text-primary" />,
  pro: <Crown size={24} className="text-warning" />,
};

/**
 * @description 定价页面 — 展示订阅计划和付费入口
 */
export default function PricingPage() {
  const currentTier = useStore((s) => s.settings.subscription);
  const setSubscription = useStore((s) => s.setSubscription);
  const resetMonthlyUsage = useStore((s) => s.resetMonthlyUsage);

  const handleSubscribe = (tier: SubscriptionTier) => {
    setSubscription(tier);
    if (tier !== "free") {
      resetMonthlyUsage();
    }
  };

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full p-2 text-text-muted hover:bg-surface dark:text-text-muted-dark dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-text dark:text-text-dark">
          Pricing
        </h1>
      </div>

      {/* Tagline */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-text dark:text-text-dark">
          Choose Your Plan
        </h2>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          Start free, upgrade as you grow. Cancel anytime.
        </p>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.tier;
          const isPopular = plan.tier === "starter";

          return (
            <div
              key={plan.tier}
              className={`relative rounded-2xl border-2 p-5 transition-all ${
                isCurrent
                  ? "border-primary bg-primary/5 shadow-md"
                  : isPopular
                    ? "border-primary/50 shadow-sm"
                    : "border-border dark:border-border-dark"
              }`}
            >
              {isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-success px-3 py-0.5 text-xs font-bold text-white">
                  CURRENT PLAN
                </div>
              )}

              <div className="mb-4 flex items-center gap-3">
                {TIER_ICONS[plan.tier]}
                <div>
                  <h3 className="font-bold text-text dark:text-text-dark">
                    {plan.name}
                  </h3>
                  <p className="text-2xl font-bold text-text dark:text-text-dark">
                    {plan.price === 0 ? (
                      "Free"
                    ) : (
                      <>
                        ${plan.price}
                        <span className="text-sm font-normal text-text-muted dark:text-text-muted-dark">
                          /month
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <ul className="mb-5 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-text dark:text-text-dark"
                  >
                    <Check size={16} className="shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.tier)}
                disabled={isCurrent}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity ${
                  isCurrent
                    ? "cursor-default bg-border text-text-muted dark:bg-border-dark dark:text-text-muted-dark"
                    : "bg-primary text-white hover:opacity-90"
                }`}
              >
                {isCurrent
                  ? "Current Plan"
                  : plan.price === 0
                    ? "Downgrade"
                    : "Subscribe Now"}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="mt-8 pb-8">
        <p className="text-center text-xs text-text-muted dark:text-text-muted-dark">
          MVP demo — payment integration via Stripe will be added in production.
          <br />
          Switching plans takes effect immediately.
        </p>
      </div>
    </div>
  );
}
