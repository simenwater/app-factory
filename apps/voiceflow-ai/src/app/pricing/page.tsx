'use client';

import { Check, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import { useStore } from '@/store/useStore';

/**
 * @description 定价计划
 */
const plans = [
  {
    id: 'free',
    name: '免费体验',
    price: '$0',
    period: '',
    desc: '快速体验 AI 语音整理',
    features: ['3 次免费使用', '智能摘要', '文本导出', '深色模式'],
    cta: '当前方案',
    disabled: true,
  },
  {
    id: 'monthly',
    name: '月度订阅',
    price: '$4.99',
    period: '/月',
    desc: '适合日常使用的创作者',
    features: ['无限次使用', '全部重写风格', 'Markdown 导出', '多语言支持', '优先处理'],
    cta: '立即订阅',
    popular: true,
  },
  {
    id: 'lifetime',
    name: '终身买断',
    price: '$29.99',
    period: ' 一次性',
    desc: '永久解锁全部功能',
    features: ['无限次使用', '全部重写风格', 'Markdown 导出', '多语言支持', '优先处理', '未来功能免费'],
    cta: '立即购买',
  },
];

/**
 * @description 定价页面
 */
export default function PricingPage() {
  const { user, upgradeSubscription } = useStore();

  /**
   * @description 处理订阅购买
   */
  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return;

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: planId }),
      });
      const data = await res.json();

      if (data.url) {
        upgradeSubscription(planId as 'monthly' | 'lifetime');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
    }
  };

  return (
    <>
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">选择适合你的方案</h1>
          <p className="text-gray-500 dark:text-gray-400">
            免费试用 3 次，升级后无限使用 AI 语音整理
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const isActive =
              (plan.id === 'free' && user.subscription === 'free') ||
              plan.id === user.subscription;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.popular
                    ? 'border-violet-500 shadow-lg shadow-violet-100 dark:shadow-violet-900/20'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full">
                    <Sparkles className="w-3 h-3" />
                    最受欢迎
                  </div>
                )}

                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{plan.desc}</p>

                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isActive || plan.disabled}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                      : plan.popular
                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  }`}
                >
                  {isActive ? '当前方案' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
