'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

/**
 * @description 免费额度用尽时显示的订阅引导横幅
 */
export default function SubscriptionBanner() {
  const { user, canStartInterview } = useStore();

  if (user.subscription !== 'free' || canStartInterview()) return null;

  return (
    <div className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-4 py-3 rounded-xl flex items-center justify-between gap-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">
          您已用完 {user.maxFreeInterviews} 次免费面试机会。升级 Pro 解锁无限面试和详细分析报告！
        </p>
      </div>
      <Link
        href="/pricing"
        className="px-4 py-1.5 bg-white text-brand-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
      >
        立即升级
      </Link>
    </div>
  );
}
