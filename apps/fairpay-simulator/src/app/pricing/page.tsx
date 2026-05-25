'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import PricingSection from '@/components/PricingCard';

/**
 * @description 独立的定价页面
 */
export default function PricingPage() {
  const { isDarkMode } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-16">
        <PricingSection />
      </main>
      <footer className="px-4 py-6 text-center text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} FairPay Simulator. All rights reserved.
      </footer>
    </div>
  );
}
