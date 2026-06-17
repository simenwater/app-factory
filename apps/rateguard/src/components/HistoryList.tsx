"use client";

/**
 * @fileoverview 分析历史列表组件
 */

import { Clock, ChevronRight } from "lucide-react";
import { useAppStore } from "@/store";
import { BudgetRisk } from "@/types";

/** 风险等级颜色标记 */
const RISK_DOT: Record<BudgetRisk, string> = {
  low: "bg-green-400",
  medium: "bg-yellow-400",
  high: "bg-orange-400",
  critical: "bg-red-400",
};

/**
 * HistoryList - 显示用户的分析历史记录
 */
export function HistoryList() {
  const history = useAppStore((s) => s.history);

  if (history.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <Clock className="h-5 w-5 text-gray-400" />
        分析历史
      </h3>
      <div className="space-y-2">
        {history.slice(0, 10).map((record) => (
          <div
            key={record.id}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span
              className={`h-2 w-2 flex-shrink-0 rounded-full ${RISK_DOT[record.analysis.riskLevel]}`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                {record.clientMessage.slice(0, 60)}...
              </p>
              <p className="text-xs text-gray-400">
                {new Date(record.timestamp).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              ${record.pricing.recommendedRate}/h
            </span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
