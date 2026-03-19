import { format, parseISO, isToday, isYesterday } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { PolicyAlert, RiskLevel, DailySummary, IndustryType } from "@/types";

/**
 * 格式化日期为中文友好格式
 * @param {string} dateStr - ISO 日期字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "今天";
  if (isYesterday(date)) return "昨天";
  return format(date, "M月d日 EEEE", { locale: zhCN });
}

/**
 * 格式化完整日期时间
 * @param {string} dateStr - ISO 日期字符串
 * @returns {string} 格式化后的日期时间
 */
export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), "yyyy年M月d日 HH:mm", { locale: zhCN });
}

/**
 * 计算风险等级数值（用于排序）
 * @param {RiskLevel} level - 风险等级
 * @returns {number} 数值分数
 */
export function riskLevelScore(level: RiskLevel): number {
  const scores: Record<RiskLevel, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  return scores[level];
}

/**
 * 按风险等级降序排序政策预警
 * @param {PolicyAlert[]} alerts - 政策预警列表
 * @returns {PolicyAlert[]} 排序后的列表
 */
export function sortByRisk(alerts: PolicyAlert[]): PolicyAlert[] {
  return [...alerts].sort(
    (a, b) => riskLevelScore(b.riskLevel) - riskLevelScore(a.riskLevel)
  );
}

/**
 * 按行业过滤政策预警
 * @param {PolicyAlert[]} alerts - 政策预警列表
 * @param {IndustryType[]} industries - 筛选行业
 * @returns {PolicyAlert[]} 过滤后的列表
 */
export function filterByIndustry(
  alerts: PolicyAlert[],
  industries: IndustryType[]
): PolicyAlert[] {
  if (industries.length === 0) return alerts;
  return alerts.filter((alert) =>
    alert.affectedIndustries.some((ind) => industries.includes(ind))
  );
}

/**
 * 按风险等级过滤政策预警
 * @param {PolicyAlert[]} alerts - 政策预警列表
 * @param {RiskLevel[]} levels - 筛选风险等级
 * @returns {PolicyAlert[]} 过滤后的列表
 */
export function filterByRiskLevel(
  alerts: PolicyAlert[],
  levels: RiskLevel[]
): PolicyAlert[] {
  if (levels.length === 0) return alerts;
  return alerts.filter((a) => levels.includes(a.riskLevel));
}

/**
 * 根据政策列表生成每日摘要
 * @param {PolicyAlert[]} alerts - 当日政策预警列表
 * @param {string} date - 日期字符串
 * @returns {DailySummary} 每日摘要
 */
export function generateDailySummary(
  alerts: PolicyAlert[],
  date: string
): DailySummary {
  const criticalCount = alerts.filter((a) => a.riskLevel === "critical").length;
  const highCount = alerts.filter((a) => a.riskLevel === "high").length;
  const mediumCount = alerts.filter((a) => a.riskLevel === "medium").length;
  const lowCount = alerts.filter((a) => a.riskLevel === "low").length;

  let overallRisk: RiskLevel = "low";
  if (criticalCount > 0) overallRisk = "critical";
  else if (highCount > 0) overallRisk = "high";
  else if (mediumCount > 0) overallRisk = "medium";

  const sorted = sortByRisk(alerts);
  const topAlerts = sorted.slice(0, 3);
  const highlights = topAlerts.map((a) => a.summary);

  return {
    date,
    overallRisk,
    alertCount: alerts.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    topAlerts,
    highlights,
  };
}

/**
 * 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * 搜索政策预警
 * @param {PolicyAlert[]} alerts - 政策预警列表
 * @param {string} query - 搜索关键词
 * @returns {PolicyAlert[]} 匹配的预警列表
 */
export function searchAlerts(
  alerts: PolicyAlert[],
  query: string
): PolicyAlert[] {
  if (!query.trim()) return alerts;
  const lower = query.toLowerCase();
  return alerts.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.summary.toLowerCase().includes(lower) ||
      a.tags.some((t) => t.toLowerCase().includes(lower))
  );
}
