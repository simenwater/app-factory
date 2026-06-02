"use client";

import { Crown, Check } from "lucide-react";
import { useAppStore } from "@/store";

/**
 * @description 付费墙弹窗组件 - 免费次数用完时显示
 */
export function PaywallModal() {
  const { subscription } = useAppStore();

  const handleSubscribe = (plan: "monthly" | "lifetime") => {
    /** @todo 集成实际支付网关 (Stripe/Paddle) */
    alert(
      `Payment integration coming soon!\n\nPlan: ${plan === "monthly" ? "$4.99/month" : "$29.99 lifetime"}\n\nThis would redirect to a payment page in production.`
    );
  };

  if (subscription.plan !== "free" || subscription.freeUsesRemaining > 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-(--color-background) rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-(--color-primary)/10 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-(--color-primary)" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
          <p className="text-(--color-muted) text-sm">
            You&apos;ve used all 3 free analyses. Upgrade to unlock unlimited access to all
            features.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {FEATURES.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-(--color-success) shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSubscribe("monthly")}
            className="w-full py-3 px-6 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white font-medium rounded-xl transition-colors"
          >
            $4.99/month — Subscribe
          </button>
          <button
            onClick={() => handleSubscribe("lifetime")}
            className="w-full py-3 px-6 border-2 border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary)/5 font-medium rounded-xl transition-colors"
          >
            $29.99 — Lifetime Access
          </button>
        </div>

        <p className="text-xs text-(--color-muted) text-center mt-4">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </div>
  );
}

const FEATURES = [
  "Unlimited message analysis",
  "All rejection tone templates",
  "Professional quote builder",
  "Priority template updates",
  "Export quotes as PDF (coming soon)",
];
