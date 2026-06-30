/**
 * @fileoverview 定价页面
 */

'use client';

import { useState } from 'react';
import PricingCard from '@/components/PricingCard';
import { PLANS } from '@/lib/plans';

/**
 * 定价页面组件
 * @returns {JSX.Element}
 */
export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          简单透明的定价
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          免费开始，按需升级。为独立开发者和团队量身定制。
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium ${!yearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
          >
            月付
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              yearly ? 'bg-violet-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label="切换年付/月付"
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                yearly ? 'translate-x-5.5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${yearly ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
          >
            年付
            <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 dark:bg-green-900 dark:text-green-300">
              省 17%
            </span>
          </span>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
        <PricingCard plan={PLANS.free} yearly={yearly} />
        <PricingCard plan={PLANS.pro} yearly={yearly} popular />
        <PricingCard plan={PLANS.team} yearly={yearly} />
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          常见问题
        </h3>
        <div className="mx-auto mt-8 max-w-2xl space-y-6 text-left">
          {[
            {
              q: '免费计划有什么限制？',
              a: '免费计划每月可分析 3 个仓库，生成基础 AGENTS.md 文件，支持单工具标准导出。',
            },
            {
              q: '支持私有仓库吗？',
              a: '支持！只需在设置中配置 GitHub Personal Access Token，即可分析私有仓库。',
            },
            {
              q: '自动同步如何工作？',
              a: 'Pro 计划支持 GitHub Webhook 集成，当代码库发生变更时自动重新生成并更新配置文件。',
            },
            {
              q: '可以取消订阅吗？',
              a: '当然！你可以随时取消订阅，取消后当前周期结束前仍可使用 Pro 功能。',
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {faq.q}
              </h4>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
