'use client';

import { useStore } from '@/store/useStore';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Award,
  ArrowUpRight,
  FileText,
  BarChart3,
} from 'lucide-react';

/**
 * @description 格式化货币显示
 */
function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

/**
 * @description 模拟结果展示组件 — 包含薪酬推荐、利润影响和留存率预测
 */
export default function SimulationResults() {
  const { simulationResult, reset } = useStore();
  if (!simulationResult) return null;

  const { recommendations, profitImpact, retentionPrediction, overallScore, summary } = simulationResult;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Score & Summary */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Simulation Complete</h2>
            <p className="text-emerald-100 text-sm">
              FairPay analysis for {simulationResult.companyInfo.name}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{overallScore}</div>
            <div className="text-emerald-200 text-xs">FairPay Score</div>
          </div>
        </div>
        <p className="text-emerald-50 text-sm leading-relaxed">{summary}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Additional Cost"
          value={formatCurrency(profitImpact.additionalCost)}
          subtext={`+${profitImpact.additionalCostPercent}% of payroll`}
          color="blue"
        />
        <MetricCard
          icon={<BarChart3 className="w-5 h-5" />}
          label="Profit Margin"
          value={`${profitImpact.projectedProfitMargin}%`}
          subtext={`from ${profitImpact.currentProfitMargin}%`}
          color={profitImpact.projectedProfitMargin >= profitImpact.currentProfitMargin ? 'green' : 'amber'}
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Retention Boost"
          value={`+${retentionPrediction.retentionImprovement}%`}
          subtext={`${retentionPrediction.employeesRetained} more retained`}
          color="emerald"
        />
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          label="Break-even"
          value={`${profitImpact.breakEvenMonths} mo`}
          subtext={`ROI ${formatCurrency(profitImpact.roiFromRetention)}`}
          color="purple"
        />
      </div>

      {/* Compensation Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-500" />
          Compensation Recommendations
        </h3>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.positionId}
              className="border border-gray-100 dark:border-gray-700 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {rec.positionTitle}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Market Median: {formatCurrency(rec.marketMedian)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                    P{rec.marketPercentile}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-0.5">Current</div>
                  <div className="font-semibold text-gray-700 dark:text-gray-300">
                    {formatCurrency(rec.currentSalary)}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-emerald-500 mb-0.5">Recommended</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                    {formatCurrency(rec.recommendedSalary)}
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <div className="text-xs text-gray-400 mb-0.5">Increase</div>
                  <div className="font-semibold text-amber-600 dark:text-amber-400">
                    {rec.salaryIncreasePercent > 0 ? (
                      <>
                        <TrendingUp className="w-3.5 h-3.5 inline mr-0.5" />
                        +{rec.salaryIncreasePercent.toFixed(1)}%
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3.5 h-3.5 inline mr-0.5" />
                        No change
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Percentile bar */}
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, rec.marketPercentile)}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {rec.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Profit Impact Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Profit Impact
          </h3>
          <div className="space-y-3">
            <DetailRow
              label="Current Payroll"
              value={formatCurrency(profitImpact.currentTotalSalaryCost)}
            />
            <DetailRow
              label="Proposed Payroll"
              value={formatCurrency(profitImpact.proposedTotalSalaryCost)}
              highlight
            />
            <DetailRow
              label="Additional Cost"
              value={`+${formatCurrency(profitImpact.additionalCost)}`}
            />
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
              <DetailRow
                label="Current Profit Margin"
                value={`${profitImpact.currentProfitMargin}%`}
              />
              <DetailRow
                label="Projected Profit Margin"
                value={`${profitImpact.projectedProfitMargin}%`}
                highlight
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            Retention Prediction
          </h3>
          <div className="space-y-3">
            <DetailRow
              label="Current Retention Rate"
              value={`${retentionPrediction.currentRetentionRate}%`}
            />
            <DetailRow
              label="Projected Retention Rate"
              value={`${retentionPrediction.projectedRetentionRate}%`}
              highlight
            />
            <DetailRow
              label="Improvement"
              value={`+${retentionPrediction.retentionImprovement} pp`}
            />
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
              <DetailRow
                label="Employees Retained"
                value={`${retentionPrediction.employeesRetained} more/year`}
              />
              <DetailRow
                label="Avg Replacement Cost"
                value={formatCurrency(retentionPrediction.avgReplacementCost)}
              />
              <DetailRow
                label="Turnover Cost Saved"
                value={formatCurrency(retentionPrediction.estimatedTurnoverCostSaved)}
                highlight
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
        >
          New Simulation
        </button>
        <button
          className="flex-1 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.print();
            }
          }}
        >
          <FileText className="w-4 h-4" /> Export Report
        </button>
      </div>
    </div>
  );
}

/**
 * @description 指标卡片组件
 */
function MetricCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: 'blue' | 'green' | 'amber' | 'emerald' | 'purple';
}) {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</div>
      <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-400 dark:text-gray-500">{subtext}</div>
    </div>
  );
}

/**
 * @description 详情行组件
 */
function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
