import type { RiskLevel } from "@/types";
import { riskLevelColor, riskLevelLabel } from "@/lib/utils";

/**
 * @description 风险等级徽章组件
 */
export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${riskLevelColor(level)}`}
    >
      {riskLevelLabel(level)}
    </span>
  );
}
