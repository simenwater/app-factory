'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import CompanyInfoForm from '@/components/CompanyInfoForm';
import PositionForm from '@/components/PositionForm';
import SimulationResults from '@/components/SimulationResults';
import PricingSection from '@/components/PricingCard';

/**
 * @description 主页面，根据 step 渲染不同阶段的内容
 */
export default function HomePage() {
  const { step, isDarkMode } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Header />

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Step indicator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2">
            {['Company Info', 'Positions', 'Results'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    i <= step
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-sm hidden sm:inline ${
                    i <= step
                      ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {label}
                </span>
                {i < 2 && (
                  <div
                    className={`w-8 h-0.5 ${
                      i < step ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        {step === 0 && <CompanyInfoForm />}
        {step === 1 && <PositionForm />}
        {step === 2 && <SimulationResults />}
      </main>

      {/* Pricing Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <PricingSection />
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 text-center text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} FairPay Simulator. Market data is for illustrative purposes.
      </footer>
    </div>
  );
}
