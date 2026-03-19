import { RISK_CONFIG, type RiskLevel } from "@/types";

/**
 * @component RiskBadge
 * 风险等级徽章
 * @param {Object} props
 * @param {RiskLevel} props.level - 风险等级
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - 徽章大小
 */
export function RiskBadge({
  level,
  size = "md",
}: {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
}) {
  const config = RISK_CONFIG[level];

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizeClasses[size]}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
