"use client";

import type { RiskLevel } from "@/types";
import { getRiskColor, getRiskLabel } from "@/lib/utils";

/**
 * @description 风险等级徽章组件
 * @param level - 风险等级
 * @param size - 尺寸
 */
export default function RiskBadge({
  level,
  size = "sm",
}: {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${getRiskColor(level)} ${sizeClasses[size]}`}
    >
      {level === "critical" && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse-dot" />
      )}
      {getRiskLabel(level)}
    </span>
  );
}
