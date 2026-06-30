/**
 * @fileoverview 定价卡片组件
 */

'use client';

import { Check } from 'lucide-react';
import type { PlanDetails } from '@/types';

/**
 * @param {{ plan: PlanDetails; yearly: boolean; popular?: boolean }} props
 * @returns {JSX.Element}
 */
export default function PricingCard({
  plan,
  yearly,
  popular,
}: {
  plan: PlanDetails;
  yearly: boolean;
  popular?: boolean;
}) {
  const price = yearly ? plan.priceYearly : plan.price;
  const period = yearly ? '/年' : '/月';

  /**
   * 处理订阅点击
   */
  async function handleSubscribe() {
    if (plan.type === 'free') {
      window.location.href = '/dashboard';
      return;
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.type,
          interval: yearly ? 'yearly' : 'monthly',
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch {
      alert('支付服务暂不可用，请稍后重试');
    }
  }

  return (
    <div
      className={`relative rounded-2xl border-2 p-8 transition-all ${
        popular
          ? 'border-violet-500 bg-white shadow-xl shadow-violet-100 dark:border-violet-400 dark:bg-gray-900 dark:shadow-violet-900/20'
          : 'border-gray-200 bg-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-900'
      }`}
    >
      {popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white">
          最受欢迎
        </div>
      )}

      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {plan.name}
        </h3>
        <div className="mt-4 flex items-baseline justify-center gap-1">
          <span className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            ${price}
          </span>
          {price > 0 && (
            <span className="text-gray-500 dark:text-gray-400">{period}</span>
          )}
        </div>
        {yearly && price > 0 && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
            节省 ${plan.price * 12 - plan.priceYearly}/年
          </p>
        )}
      </div>

      <ul className="mt-8 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
          popular
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg'
            : 'border-2 border-gray-200 text-gray-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-violet-600 dark:hover:bg-violet-950'
        }`}
      >
        {plan.type === 'free' ? '免费开始' : '立即订阅'}
      </button>
    </div>
  );
}
