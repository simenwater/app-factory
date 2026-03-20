"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Check, Crown, Zap, Loader2, ExternalLink } from "lucide-react";

/**
 * @description Free plan feature list
 */
const freePlanFeatures = [
  "Basic pricing calculator",
  "Industry pricing model recommendations",
  "3 reports per month",
  "Basic value analysis",
];

/**
 * @description Premium plan feature list
 */
const premiumFeatures = [
  "All Free features",
  "Advanced pricing models",
  "Detailed competitor comparison data",
  "Unlimited report generation",
  "PDF report export",
  "Multi-currency support",
  "Priority customer support",
  "Pricing A/B test recommendations",
];

/**
 * @description Subscription pricing page with Stripe integration
 */
export default function PricingPage() {
  const tier = useStore((s) => s.settings.subscriptionTier);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @description Redirect to Stripe Checkout for subscription
   */
  async function handleSubscribe() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceType: "monthly" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to create checkout session. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * @description Redirect to Stripe Customer Portal for subscription management
   */
  async function handleManageSubscription() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to open subscription portal. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-text dark:text-text-dark">
          Upgrade Your Pricing Strategy
        </h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          Unlock advanced features for smarter pricing decisions
        </p>
      </div>

      <div className="space-y-4">
        <div
          className={`rounded-xl border-2 p-5 ${
            tier === "free"
              ? "border-primary bg-primary/5 dark:bg-primary/10"
              : "border-border bg-surface dark:border-border-dark dark:bg-surface-dark"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-text-muted dark:text-text-muted-dark" />
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                Free
              </h2>
            </div>
            {tier === "free" && (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                Current Plan
              </span>
            )}
          </div>
          <p className="mb-4 text-3xl font-bold text-text dark:text-text-dark">
            $0
            <span className="text-sm font-normal text-text-muted dark:text-text-muted-dark">
              /mo
            </span>
          </p>
          <ul className="space-y-2">
            {freePlanFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark"
              >
                <Check size={16} className="text-success" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`rounded-xl border-2 p-5 ${
            tier === "premium"
              ? "border-primary bg-primary/5 dark:bg-primary/10"
              : "border-border bg-surface dark:border-border-dark dark:bg-surface-dark"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                Premium
              </h2>
            </div>
            {tier === "premium" && (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                Current Plan
              </span>
            )}
          </div>
          <p className="mb-1 text-3xl font-bold text-text dark:text-text-dark">
            $9
            <span className="text-sm font-normal text-text-muted dark:text-text-muted-dark">
              /mo
            </span>
          </p>
          <p className="mb-4 text-xs text-text-muted dark:text-text-muted-dark">
            Annual billing $90/yr (save $18)
          </p>
          <ul className="mb-5 space-y-2">
            {premiumFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark"
              >
                <Check size={16} className="text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={tier === "premium" ? handleManageSubscription : handleSubscribe}
            disabled={isLoading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-colors ${
              tier === "premium"
                ? "bg-border text-text-muted dark:bg-border-dark dark:text-text-muted-dark"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : tier === "premium" ? (
              <>
                Manage Subscription
                <ExternalLink size={14} />
              </>
            ) : (
              <>
                Upgrade to Premium
                <ExternalLink size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-text-muted dark:text-text-muted-dark">
        Secure payment powered by Stripe
      </p>
    </div>
  );
}
