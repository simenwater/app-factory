import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import type { RiskLevel, TrackingStatus } from "@/types";

/**
 * @returns 唯一 ID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * @param date - 日期字符串或 Date 对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), "yyyy-MM-dd HH:mm");
}

/**
 * @param level - 风险等级
 * @returns 对应的颜色 class
 */
export function riskLevelColor(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: "text-green-500 bg-green-500/10",
    medium: "text-yellow-500 bg-yellow-500/10",
    high: "text-orange-500 bg-orange-500/10",
    critical: "text-red-500 bg-red-500/10",
  };
  return map[level];
}

/**
 * @param level - 风险等级
 * @returns 中文描述
 */
export function riskLevelLabel(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: "低风险",
    medium: "中风险",
    high: "高风险",
    critical: "危险",
  };
  return map[level];
}

/**
 * @param status - 追踪状态
 * @returns 对应的颜色 class
 */
export function trackingStatusColor(status: TrackingStatus): string {
  const map: Record<TrackingStatus, string> = {
    draft: "text-text-muted bg-text-muted/10 dark:text-text-muted-dark",
    sent: "text-blue-500 bg-blue-500/10",
    effective: "text-green-500 bg-green-500/10",
    needs_revision: "text-orange-500 bg-orange-500/10",
  };
  return map[status];
}

/**
 * @param status - 追踪状态
 * @returns 中文描述
 */
export function trackingStatusLabel(status: TrackingStatus): string {
  const map: Record<TrackingStatus, string> = {
    draft: "草稿",
    sent: "已发送",
    effective: "有效",
    needs_revision: "需修改",
  };
  return map[status];
}

/**
 * @param score - 情感分数 (0-100)
 * @returns 风险等级
 */
export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}
