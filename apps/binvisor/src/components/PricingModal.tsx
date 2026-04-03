"use client";

/**
 * @fileoverview 定价弹窗组件
 */

import { useStore } from "@/store/useStore";
import { X, Check, Zap, Crown } from "lucide-react";
import type { PricingPlan } from "@/types";

/** 定价方案 */
const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "once",
    features: [
      "Basic protocol parsing",
      "Up to 10 fields",
      "SVG export",
      "Light & dark mode",
    ],
  },
  {
    id: "pro-once",
    name: "Pro (Lifetime)",
    price: 9.99,
    period: "once",
    features: [
      "Unlimited fields",
      "All export formats (SVG, PNG, JSON, MD)",
      "Save & load protocols",
      "Custom color themes",
      "Priority support",
    ],
    recommended: true,
  },
  {
    id: "pro-monthly",
    name: "Pro (Monthly)",
    price: 4.99,
    period: "monthly",
    features: [
      "Everything in Pro Lifetime",
      "Team collaboration",
      "Protocol templates library",
      "API access",
      "Cloud sync",
    ],
  },
];

/**
 * 定价弹窗组件
 * @returns {React.ReactElement | null}
 */
export default function PricingModal() {
  const showPricing = useStore((s) => s.showPricing);
  const setShowPricing = useStore((s) => s.setShowPricing);

  if (!showPricing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowPricing(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Upgrade to Pro
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Unlock powerful features for professional protocol engineering
            </p>
          </div>
          <button
            onClick={() => setShowPricing(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 p-5 transition-all ${
                plan.recommended
                  ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-lg"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold">
                  Recommended
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                {plan.price === 0 ? (
                  <Zap className="w-5 h-5 text-gray-400" />
                ) : (
                  <Crown className="w-5 h-5 text-indigo-500" />
                )}
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                {plan.period === "monthly" && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    /mo
                  </span>
                )}
                {plan.period === "once" && plan.price > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    one-time
                  </span>
                )}
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  plan.recommended
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md"
                    : plan.price === 0
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 cursor-default"
                    : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                }`}
                disabled={plan.price === 0}
              >
                {plan.price === 0 ? "Current Plan" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
