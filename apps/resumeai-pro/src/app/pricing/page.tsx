"use client";

import { Check, Star, Zap, Crown } from "lucide-react";
import type { PricingPlan } from "@/types";

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      "1 resume",
      "Basic templates",
      "PDF export",
      "ATS score check (3/month)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    interval: "month",
    popular: true,
    features: [
      "Unlimited resumes",
      "All premium templates",
      "PDF & Word export",
      "Unlimited ATS checks",
      "AI content generation",
      "Job description matching",
      "Priority support",
    ],
  },
  {
    id: "single",
    name: "Single Use",
    price: 2.99,
    interval: "once",
    features: [
      "1 AI-optimized resume",
      "All templates",
      "PDF & Word export",
      "1 ATS deep analysis",
      "Keyword optimization",
    ],
  },
];

const planIcons: Record<string, typeof Star> = {
  free: Star,
  pro: Crown,
  single: Zap,
};

/**
 * @description 定价页面 — 展示订阅方案
 */
export default function PricingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark md:text-3xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-2 text-text-muted dark:text-text-muted-dark">
          Choose the plan that works best for you. Upgrade anytime.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = planIcons[plan.id] || Star;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-6 transition-shadow ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                  : "border-border dark:border-border-dark"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-4 text-center">
                <div
                  className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${
                    plan.popular
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon size={24} />
                </div>
                <h2 className="text-lg font-bold text-text dark:text-text-dark">
                  {plan.name}
                </h2>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-text dark:text-text-dark">
                    ${plan.price}
                  </span>
                  {plan.interval !== "once" && (
                    <span className="text-text-muted dark:text-text-muted-dark">
                      /{plan.interval}
                    </span>
                  )}
                  {plan.interval === "once" && (
                    <span className="text-text-muted dark:text-text-muted-dark">
                      {" "}
                      one-time
                    </span>
                  )}
                </div>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-text dark:text-text-dark"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-success"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  plan.popular
                    ? "bg-primary text-white shadow-md hover:bg-primary-dark"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {plan.price === 0 ? "Get Started Free" : `Choose ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-text-muted dark:text-text-muted-dark">
        All plans include a 7-day money-back guarantee. No questions asked.
      </div>
    </div>
  );
}
