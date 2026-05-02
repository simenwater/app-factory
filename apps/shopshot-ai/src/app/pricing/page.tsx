'use client';

import { PRICING_PLANS } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';
import { Check } from 'lucide-react';

/**
 * @description 定价页面 - 展示订阅计划
 */
export default function PricingPage() {
  const subscription = useAppStore((s) => s.subscription);

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="text-center py-6">
        <h1 className="text-2xl font-bold">选择您的方案</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          7 天免费试用，随时取消
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border p-6 transition-all ${
              plan.id === 'basic'
                ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                : 'border-gray-200 dark:border-gray-800'
            }`}
          >
            {plan.id === 'basic' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                最受欢迎
              </span>
            )}

            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <div className="mt-3">
              <span className="text-3xl font-bold">
                {plan.price === 0 ? '免费' : `$${plan.price}`}
              </span>
              {plan.price > 0 && (
                <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
              )}
            </div>

            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`mt-6 w-full py-2.5 rounded-xl font-medium transition-colors ${
                plan.id === subscription.plan
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-default'
                  : plan.id === 'basic'
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  : 'bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900'
              }`}
              disabled={plan.id === subscription.plan}
            >
              {plan.id === subscription.plan ? '当前方案' : '立即订阅'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
        超出额度按 $0.5/张计费 · 支持 Stripe 安全支付
      </p>
    </div>
  );
}
