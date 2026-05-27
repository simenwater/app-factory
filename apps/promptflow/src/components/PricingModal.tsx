'use client';

import { X, Check, Crown } from 'lucide-react';
import { PLANS } from '@/lib/pricing';

/** @description PricingModal 组件 Props */
interface PricingModalProps {
  onClose: () => void;
}

/**
 * @description 定价弹窗组件，展示免费与付费套餐对比
 * @param {PricingModalProps} props
 */
export function PricingModal({ onClose }: PricingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl p-6"
        style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              选择你的套餐
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              解锁更多高级功能，提升 AI 编程效率
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2" style={{ color: 'var(--text-tertiary)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              className="relative rounded-xl border p-5"
              style={{
                borderColor: plan.tier === 'pro' ? 'var(--accent)' : 'var(--border)',
                background: plan.tier === 'pro' ? 'var(--accent-light)' : 'var(--bg-secondary)',
              }}
            >
              {plan.tier === 'pro' && (
                <div
                  className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  <Crown size={12} />
                  推荐
                </div>
              )}
              <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {plan.price === 0 ? '免费' : `$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    /月
                  </span>
                )}
              </div>
              <ul className="mb-5 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check size={14} style={{ color: 'var(--success)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full rounded-lg py-2 text-sm font-medium transition-colors"
                style={{
                  background: plan.tier === 'pro' ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: plan.tier === 'pro' ? 'white' : 'var(--text-secondary)',
                }}
              >
                {plan.tier === 'free' ? '当前套餐' : '升级到 Pro'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
