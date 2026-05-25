'use client';

import { useStore } from '@/store/useStore';
import { INDUSTRY_LABELS, REGION_LABELS } from '@/lib/market-data';
import { Building2, MapPin, Users, DollarSign, Wallet } from 'lucide-react';
import type { Industry, Region } from '@/types';

/**
 * @description 公司基本信息输入表单
 */
export default function CompanyInfoForm() {
  const { companyInfo, setCompanyInfo, setStep } = useStore();

  const isValid =
    companyInfo.name.trim() !== '' &&
    companyInfo.annualRevenue > 0 &&
    companyInfo.employeeCount > 0 &&
    companyInfo.annualBudgetForSalaries > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tell us about your company
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          We&apos;ll use this information to generate market-competitive compensation plans.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5">
        {/* Company Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <Building2 className="w-4 h-4" />
            Company Name
          </label>
          <input
            type="text"
            value={companyInfo.name}
            onChange={(e) => setCompanyInfo({ name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="Acme Inc."
          />
        </div>

        {/* Industry & Region */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Building2 className="w-4 h-4" />
              Industry
            </label>
            <select
              value={companyInfo.industry}
              onChange={(e) => setCompanyInfo({ industry: e.target.value as Industry })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              {Object.entries(INDUSTRY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <MapPin className="w-4 h-4" />
              Region
            </label>
            <select
              value={companyInfo.region}
              onChange={(e) => setCompanyInfo({ region: e.target.value as Region })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            >
              {Object.entries(REGION_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Count */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <Users className="w-4 h-4" />
            Total Employee Count
          </label>
          <input
            type="number"
            value={companyInfo.employeeCount || ''}
            onChange={(e) => setCompanyInfo({ employeeCount: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="10"
            min={1}
          />
        </div>

        {/* Revenue & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <DollarSign className="w-4 h-4" />
              Annual Revenue ($)
            </label>
            <input
              type="number"
              value={companyInfo.annualRevenue || ''}
              onChange={(e) => setCompanyInfo({ annualRevenue: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="1,000,000"
              min={0}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <Wallet className="w-4 h-4" />
              Annual Salary Budget ($)
            </label>
            <input
              type="number"
              value={companyInfo.annualBudgetForSalaries || ''}
              onChange={(e) => setCompanyInfo({ annualBudgetForSalaries: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="500,000"
              min={0}
            />
          </div>
        </div>

        <button
          onClick={() => setStep(1)}
          disabled={!isValid}
          className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Next: Add Positions
        </button>
      </div>
    </div>
  );
}
