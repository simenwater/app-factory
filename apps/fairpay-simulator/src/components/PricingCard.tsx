'use client';

import { Check, Sparkles } from 'lucide-react';
import type { SubscriptionPlan } from '@/types';

/** @description 预设订阅方案 */
const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'monthly',
    simulationsPerMonth: 3,
    exportEnabled: false,
    features: [
      '3 simulations per month',
      'Basic market data',
      'Compensation recommendations',
      'Retention predictions',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.9,
    period: 'monthly',
    simulationsPerMonth: 'unlimited',
    exportEnabled: true,
    highlighted: true,
    features: [
      'Unlimited simulations',
      'Detailed market data by region',
      'Advanced profit modeling',
      'PDF & CSV report export',
      'Retention optimizer',
      'Priority support',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    price: 29.9,
    period: 'monthly',
    simulationsPerMonth: 'unlimited',
    exportEnabled: true,
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared simulation library',
      'API access',
      'Custom industry benchmarks',
      'Dedicated account manager',
    ],
  },
];

/**
 * @description 订阅定价卡片展示组件
 */
export default function PricingSection() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Simple, transparent pricing
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Start free. Upgrade when you need unlimited simulations and detailed reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl border p-6 flex flex-col ${
              plan.highlighted
                ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]'
                : 'border-gray-200 dark:border-gray-700 shadow-sm'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Most Popular
              </div>
            )}

            <div className="mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                plan.highlighted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {plan.price === 0 ? 'Get Started' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
