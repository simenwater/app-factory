"use client";

/**
 * @fileoverview 分析结果展示组件
 */

import { AlertTriangle, CheckCircle, TrendingUp, XCircle } from "lucide-react";
import { useAppStore } from "@/store";
import { BudgetRisk } from "@/types";

/** 风险等级颜色配置 */
const RISK_COLORS: Record<BudgetRisk, { bg: string; text: string; border: string }> = {
  low: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", border: "border-green-200 dark:border-green-800" },
  medium: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800" },
  high: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  critical: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
};

/** 风险等级标签 */
const RISK_LABELS: Record<BudgetRisk, string> = {
  low: "低风险",
  medium: "中等风险",
  high: "高风险",
  critical: "极高风险",
};

/**
 * AnalysisResult - 展示消息分析结果
 */
export function AnalysisResult() {
  const { currentAnalysis, currentPricing } = useAppStore();

  if (!currentAnalysis || !currentPricing) return null;

  const riskColor = RISK_COLORS[currentAnalysis.riskLevel];

  return (
    <div className="space-y-4">
      {/* 风险总结 */}
      <div className={`rounded-2xl border p-6 ${riskColor.bg} ${riskColor.border}`}>
        <div className="flex items-start gap-3">
          {currentAnalysis.riskLevel === "low" ? (
            <CheckCircle className={`h-6 w-6 flex-shrink-0 ${riskColor.text}`} />
          ) : (
            <AlertTriangle className={`h-6 w-6 flex-shrink-0 ${riskColor.text}`} />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${riskColor.text}`}>
                {RISK_LABELS[currentAnalysis.riskLevel]}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                复杂度 {currentAnalysis.complexityScore}/10
              </span>
            </div>
            <p className={`mt-1 text-sm ${riskColor.text}`}>
              {currentAnalysis.summary}
            </p>
          </div>
        </div>
      </div>

      {/* 红旗信号 */}
      {currentAnalysis.redFlags.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <XCircle className="h-5 w-5 text-red-500" />
            红旗信号 ({currentAnalysis.redFlags.length})
          </h3>
          <ul className="space-y-2">
            {currentAnalysis.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 积极信号 */}
      {currentAnalysis.greenFlags.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <CheckCircle className="h-5 w-5 text-green-500" />
            积极信号 ({currentAnalysis.greenFlags.length})
          </h3>
          <ul className="space-y-2">
            {currentAnalysis.greenFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 定价建议 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          定价建议
        </h3>
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400">最低价</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${currentPricing.minRate}
            </p>
            <p className="text-xs text-gray-400">/{currentPricing.unit}</p>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-center dark:bg-indigo-900/30">
            <p className="text-xs text-indigo-600 dark:text-indigo-400">推荐价</p>
            <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
              ${currentPricing.recommendedRate}
            </p>
            <p className="text-xs text-indigo-400">/{currentPricing.unit}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400">市场高价</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${currentPricing.maxRate}
            </p>
            <p className="text-xs text-gray-400">/{currentPricing.unit}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {currentPricing.reasoning}
        </p>
      </div>
    </div>
  );
}
