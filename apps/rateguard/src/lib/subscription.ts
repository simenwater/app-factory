/**
 * @fileoverview 订阅付费框架
 * 管理用户订阅状态和使用限制
 */

import { SubscriptionPlan, SubscriptionStatus } from "@/types";

/** 各计划限制配置 */
export const PLAN_LIMITS: Record<
  SubscriptionPlan,
  { maxAnalysis: number; price: number; features: string[] }
> = {
  free: {
    maxAnalysis: 3,
    price: 0,
    features: [
      "每月 3 次消息分析",
      "基础行业费率数据",
      "1 个谈判话术模板",
    ],
  },
  pro: {
    maxAnalysis: 999,
    price: 9.9,
    features: [
      "无限次消息分析",
      "完整行业费率数据库",
      "全部谈判话术模板",
      "历史记录保存",
      "自定义定价规则",
    ],
  },
  business: {
    maxAnalysis: 9999,
    price: 29.9,
    features: [
      "Pro 全部功能",
      "团队协作（最多 5 人）",
      "API 接入",
      "优先客服支持",
      "自定义品牌模板",
    ],
  },
};

/**
 * 检查用户是否可以进行分析
 * @param status - 当前订阅状态
 * @returns 是否允许分析
 */
export function canAnalyze(status: SubscriptionStatus): boolean {
  if (status.plan !== "free") return true;
  return status.analysisCount < status.maxAnalysis;
}

/**
 * 获取剩余分析次数
 * @param status - 当前订阅状态
 * @returns 剩余次数
 */
export function getRemainingAnalyses(status: SubscriptionStatus): number {
  if (status.plan !== "free") return Infinity;
  return Math.max(0, status.maxAnalysis - status.analysisCount);
}

/**
 * 创建默认的免费订阅状态
 * @returns 默认订阅状态
 */
export function createDefaultSubscription(): SubscriptionStatus {
  return {
    plan: "free",
    analysisCount: 0,
    maxAnalysis: PLAN_LIMITS.free.maxAnalysis,
    expiresAt: null,
  };
}
