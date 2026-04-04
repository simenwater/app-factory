/**
 * @fileoverview 匹配分数徽章组件
 */

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
}

/**
 * 根据分数显示不同颜色的徽章
 * @param props - 分数、尺寸和标签
 * @returns 彩色分数徽章
 */
export default function ScoreBadge({ score, size = "md", label }: ScoreBadgeProps) {
  const color =
    score >= 80
      ? "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800"
      : score >= 60
      ? "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800"
      : "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-2xl px-4 py-2 font-bold",
  };

  return (
    <div className={`inline-flex items-center gap-1 rounded-full border ${color} ${sizeClasses[size]}`}>
      <span>{score}%</span>
      {label && <span className="text-xs opacity-75">{label}</span>}
    </div>
  );
}
