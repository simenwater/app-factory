'use client';

import { CheckCircle2, Star, Zap, Crown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useStore } from '@/store/useStore';
import type { SubscriptionTier } from '@/types';

interface PlanConfig {
  id: SubscriptionTier;
  name: string;
  icon: typeof Star;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Free',
    icon: Star,
    price: '$0',
    period: '永久免费',
    description: '快速体验核心功能',
    features: [
      '3 次模拟面试',
      '基础代码评估',
      '技能分析摘要',
      '社区练习题',
    ],
    cta: '当前方案',
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    price: '$9.9',
    period: '/月',
    description: '全面提升面试能力',
    features: [
      '无限模拟面试',
      '详细代码评估报告',
      '深度弱点分析',
      '个性化练习计划',
      '面试评分和回放',
      '优先 AI 响应',
    ],
    popular: true,
    cta: '升级 Pro',
  },
  {
    id: 'sprint',
    name: '面试冲刺包',
    icon: Crown,
    price: '$49',
    period: '一次性',
    description: '面试前集中突击',
    features: [
      '包含 Pro 全部功能',
      '30 天无限使用',
      '模拟面试录音回放',
      '面试策略指导',
      '简历优化建议',
      '一对一 AI 辅导会话',
    ],
    cta: '购买冲刺包',
  },
];

/**
 * @description 定价页面 — 展示订阅方案和升级入口
 */
export default function PricingPage() {
  const { user, setSubscription } = useStore();

  /**
   * @description 处理升级/购买（模拟支付流程）
   * @param {SubscriptionTier} tier - 目标订阅级别
   */
  const handleUpgrade = (tier: SubscriptionTier) => {
    if (tier === 'free') return;
    setSubscription(tier);
    alert(`已成功升级到 ${tier === 'pro' ? 'Pro' : '面试冲刺包'} 方案！（演示模式）`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            选择适合你的方案
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            从免费试用开始，按需升级。所有方案都包含核心 AI 面试模拟功能。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = user.subscription === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 sm:p-8 transition-all ${
                  plan.popular
                    ? 'border-brand-400 dark:border-brand-500 bg-white dark:bg-gray-900 shadow-xl shadow-brand-500/10 scale-[1.02]'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-xs font-semibold rounded-full">
                    最受欢迎
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.popular
                      ? 'bg-brand-100 dark:bg-brand-900/30'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <Icon className={`w-5 h-5 ${plan.popular ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500'}`} />
                  </div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    {plan.period}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || plan.id === 'free'}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                    isCurrent
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 cursor-default'
                      : plan.popular
                        ? 'bg-brand-600 hover:bg-brand-700 text-white'
                        : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {isCurrent ? '当前方案' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            所有方案均支持 7 天无条件退款。支付由 Stripe 安全处理。
          </p>
        </div>
      </main>
    </div>
  );
}
