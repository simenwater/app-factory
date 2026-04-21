'use client';

import { useAppStore } from '@/store';
import { getStrategyDescription } from '@/lib/pricing-engine';
import InputField from './InputField';
import Card from './Card';
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Calculator,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

/**
 * @description 基于价值的定价计算器页面
 */
export default function PricingCalculator() {
  const {
    valueMetrics,
    costMetrics,
    pricingResult,
    setValueMetrics,
    setCostMetrics,
    runPricingCalculation,
  } = useAppStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
            基于价值的定价计算器
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          输入你的产品价值与成本指标，获取 AI 驱动的定价建议
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 价值指标 */}
        <Card title="📈 价值指标">
          <div className="space-y-4">
            <InputField
              label="每次使用节省的工时"
              value={valueMetrics.hoursSavedPerUse}
              onChange={(v) => setValueMetrics({ hoursSavedPerUse: v })}
              unit="小时"
              min={0}
              step={0.5}
              hint="用户每次使用你的产品可节省多少小时"
            />
            <InputField
              label="工程师平均时薪"
              value={valueMetrics.engineerHourlyRate}
              onChange={(v) => setValueMetrics({ engineerHourlyRate: v })}
              unit="$/小时"
              min={0}
              hint="目标用户的平均时薪"
            />
            <InputField
              label="每月使用频次"
              value={valueMetrics.usageFrequencyPerMonth}
              onChange={(v) => setValueMetrics({ usageFrequencyPerMonth: v })}
              unit="次/月"
              min={0}
              hint="用户预计每月使用产品的次数"
            />
            <InputField
              label="可靠性提升"
              value={valueMetrics.reliabilityImprovement}
              onChange={(v) => setValueMetrics({ reliabilityImprovement: v })}
              unit="%"
              min={0}
              max={100}
              hint="产品带来的可靠性/质量提升百分比"
            />
            <InputField
              label="替代方案成本"
              value={valueMetrics.alternativeCost}
              onChange={(v) => setValueMetrics({ alternativeCost: v })}
              unit="$/月"
              min={0}
              hint="用户使用其他替代方案的月成本"
            />
          </div>
        </Card>

        {/* 成本指标 */}
        <Card title="💵 成本指标">
          <div className="space-y-4">
            <InputField
              label="月度基础设施成本"
              value={costMetrics.infrastructureCost}
              onChange={(v) => setCostMetrics({ infrastructureCost: v })}
              unit="$/月"
              min={0}
              hint="服务器、数据库、CDN 等月度开销"
            />
            <InputField
              label="月度 API 调用成本"
              value={costMetrics.apiCost}
              onChange={(v) => setCostMetrics({ apiCost: v })}
              unit="$/月"
              min={0}
              hint="第三方 API（如 OpenAI）的月度费用"
            />
            <InputField
              label="客户获取成本（CAC）"
              value={costMetrics.customerAcquisitionCost}
              onChange={(v) => setCostMetrics({ customerAcquisitionCost: v })}
              unit="$/客户"
              min={0}
              hint="获取一个新客户的平均成本"
            />
            <InputField
              label="目标毛利率"
              value={costMetrics.targetMargin}
              onChange={(v) => setCostMetrics({ targetMargin: v })}
              unit="%"
              min={0}
              max={99}
              hint="期望达到的毛利率（SaaS 通常 60-80%）"
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <button
          onClick={runPricingCalculation}
          className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 animate-pulse-glow"
        >
          <Calculator className="w-5 h-5" />
          计算推荐定价
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {pricingResult && (
        <div className="animate-slide-up space-y-6">
          {/* 核心结果 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              icon={<DollarSign className="w-6 h-6 text-brand-500" />}
              label="推荐价格"
              value={`$${pricingResult.recommended}/月`}
              highlight
            />
            <ResultCard
              icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
              label="月度价值交付"
              value={`$${pricingResult.monthlyValueDelivered}`}
            />
            <ResultCard
              icon={<BarChart3 className="w-6 h-6 text-amber-500" />}
              label="价值捕获率"
              value={`${pricingResult.valueCaptureRate}%`}
            />
            <ResultCard
              icon={<Sparkles className="w-6 h-6 text-purple-500" />}
              label="推荐区间"
              value={`$${pricingResult.priceRange.min} - $${pricingResult.priceRange.max}`}
            />
          </div>

          {/* 详细分析 */}
          <Card title="📋 定价分析详情">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <PriceDetail label="基于价值的价格" value={pricingResult.valueBased} />
                <PriceDetail label="基于成本的底价" value={pricingResult.costBased} />
                <PriceDetail label="竞品参考价格" value={pricingResult.competitorBased} />
              </div>

              <div className="mt-4 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-200 dark:border-brand-800">
                <h4 className="font-semibold text-brand-800 dark:text-brand-200 mb-1">
                  推荐策略：{pricingResult.strategy === 'penetration' ? '渗透定价' :
                    pricingResult.strategy === 'value' ? '价值定价' :
                    pricingResult.strategy === 'premium' ? '溢价定价' : '免费增值'}
                </h4>
                <p className="text-sm text-brand-700 dark:text-brand-300">
                  {getStrategyDescription(pricingResult.strategy)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        highlight
          ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-700'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-brand-700 dark:text-brand-300' : ''}`}>
        {value}
      </p>
    </div>
  );
}

function PriceDetail({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-semibold">${value}/月</p>
    </div>
  );
}
