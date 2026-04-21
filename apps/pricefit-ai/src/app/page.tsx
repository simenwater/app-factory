'use client';

import Header from '@/components/Header';
import PricingCalculator from '@/components/PricingCalculator';
import CompetitorMatrixView from '@/components/CompetitorMatrix';
import CopywritingGenerator from '@/components/CopywritingGenerator';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import { useAppStore } from '@/store';

/**
 * @description PriceFit AI 主页面，根据 activeTab 切换三大核心功能模块
 */
export default function Home() {
  const { activeTab } = useAppStore();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <SubscriptionBanner />

        {activeTab === 'pricing' && <PricingCalculator />}
        {activeTab === 'competitors' && <CompetitorMatrixView />}
        {activeTab === 'copywriting' && <CopywritingGenerator />}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>PriceFit AI — 专为技术创始人设计的智能定价引擎</p>
          <p className="mt-1">Freemium 基础版免费 · Pro 版 $9/月 解锁全部功能</p>
        </div>
      </footer>
    </div>
  );
}
