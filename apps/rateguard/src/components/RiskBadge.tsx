"use client";

/**
 * @fileoverview 风险等级徽章组件
 */

import type { RiskLevel } from "@/types";
import { riskLevelInfo } from "@/lib/utils";

/**
 * @component RiskBadge
 * @param {Object} props
 * @param {RiskLevel} props.level - 风险等级
 * @param {number} [props.score] - 风险评分
 */
export function RiskBadge({
  level,
  score,
}: {
  level: RiskLevel;
  score?: number;
}) {
  const { label, color, bgColor } = riskLevelInfo(level);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${color} ${bgColor}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          level === "high"
            ? "bg-red-500"
            : level === "medium"
              ? "bg-amber-500"
              : "bg-green-500"
        }`}
      />
      {label}
      {score !== undefined && (
        <span className="opacity-75">({score})</span>
      )}
    </span>
  );
}
