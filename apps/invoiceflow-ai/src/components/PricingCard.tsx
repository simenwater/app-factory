"use client";

import { Check, X, Sparkles } from "lucide-react";
import { PLAN_FEATURES } from "@/lib/subscription";
import { useStore } from "@/store/useStore";

/**
 * @description 定价方案展示组件
 */
export function PricingSection() {
  const { subscription, updateSubscription } = useStore();

  const handleUpgrade = () => {
    updateSubscription({ plan: "pro" });
  };

  return (
    <section id="pricing" className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          Simple, Transparent Pricing
        </h2>
        <p className="text-[var(--muted-foreground)] mt-2">
          Start free, upgrade when you need more
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="card">
          <h3 className="text-lg font-bold text-[var(--foreground)]">
            {PLAN_FEATURES.free.name}
          </h3>
          <div className="mt-2 mb-6">
            <span className="text-3xl font-bold text-[var(--foreground)]">$0</span>
            <span className="text-[var(--muted-foreground)]">/month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {PLAN_FEATURES.free.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <Check className="w-4 h-4 text-[var(--success)] shrink-0" />
                {feature}
              </li>
            ))}
            {PLAN_FEATURES.free.limitations.map((limitation) => (
              <li key={limitation} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <X className="w-4 h-4 text-[var(--muted-foreground)] shrink-0" />
                {limitation}
              </li>
            ))}
          </ul>
          {subscription.plan === "free" ? (
            <button disabled className="btn-secondary w-full opacity-60 cursor-default">
              Current Plan
            </button>
          ) : (
            <button className="btn-secondary w-full">Downgrade</button>
          )}
        </div>

        {/* Pro Plan */}
        <div className="card relative border-[var(--primary)] border-2">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Most Popular
          </div>
          <h3 className="text-lg font-bold text-[var(--foreground)]">
            {PLAN_FEATURES.pro.name}
          </h3>
          <div className="mt-2 mb-6">
            <span className="text-3xl font-bold text-[var(--foreground)]">$9</span>
            <span className="text-[var(--muted-foreground)]">/month</span>
          </div>
          <ul className="space-y-3 mb-6">
            {PLAN_FEATURES.pro.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <Check className="w-4 h-4 text-[var(--success)] shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          {subscription.plan === "pro" ? (
            <button disabled className="btn-primary w-full opacity-60 cursor-default">
              Current Plan
            </button>
          ) : (
            <button onClick={handleUpgrade} className="btn-primary w-full">
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
