/**
 * @fileoverview 订阅与变现模块 - 管理用户订阅状态与付费逻辑
 */

import type { UserSubscription, SubscriptionPlan } from "@/types";

/** 免费计划每月发票限制 */
export const FREE_MONTHLY_LIMIT = 3;

/** Pro 计划月费（美元） */
export const PRO_MONTHLY_PRICE = 9;

/** 订阅计划功能对比 */
export const PLAN_FEATURES = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "每月 3 张免费发票",
      "基础 OCR 识别",
      "PDF 发票生成",
      "手动支付跟踪",
    ],
    limitations: ["无自动提醒", "无报表导出", "无自定义模板"],
  },
  pro: {
    name: "Pro",
    price: PRO_MONTHLY_PRICE,
    features: [
      "无限发票生成",
      "高级 AI OCR 识别",
      "自动付款提醒邮件",
      "导出财务报表",
      "自定义发票模板",
      "优先客户支持",
      "多币种支持",
    ],
    limitations: [],
  },
} as const;

/**
 * 检查用户是否可以创建新发票
 * @param {UserSubscription} subscription - 用户订阅信息
 * @returns {{ allowed: boolean; reason?: string }}
 */
export function canCreateInvoice(subscription: UserSubscription): {
  allowed: boolean;
  reason?: string;
} {
  if (subscription.plan === "pro") {
    return { allowed: true };
  }

  if (subscription.invoicesUsedThisMonth >= subscription.freeMonthlyLimit) {
    return {
      allowed: false,
      reason: `免费计划每月限制 ${subscription.freeMonthlyLimit} 张发票。升级到 Pro 计划即可无限生成。`,
    };
  }

  return { allowed: true };
}

/**
 * 获取剩余可用发票数
 * @param {UserSubscription} subscription - 用户订阅信息
 * @returns {number | null} 剩余数量（Pro 计划返回 null 表示无限）
 */
export function getRemainingInvoices(
  subscription: UserSubscription
): number | null {
  if (subscription.plan === "pro") return null;
  return Math.max(
    0,
    subscription.freeMonthlyLimit - subscription.invoicesUsedThisMonth
  );
}

/**
 * 检查功能是否可用
 * @param {SubscriptionPlan} plan - 当前计划
 * @param {string} feature - 功能名称
 * @returns {boolean}
 */
export function isFeatureAvailable(
  plan: SubscriptionPlan,
  feature: "auto_reminder" | "export_report" | "custom_template" | "multi_currency"
): boolean {
  const proOnlyFeatures = [
    "auto_reminder",
    "export_report",
    "custom_template",
    "multi_currency",
  ];

  if (plan === "pro") return true;
  return !proOnlyFeatures.includes(feature);
}

/**
 * 创建 Stripe Checkout 会话（模拟）
 * @param {string} userId - 用户 ID
 * @returns {Promise<{ url: string }>} Checkout URL
 */
export async function createCheckoutSession(
  userId: string
): Promise<{ url: string }> {
  // 实际集成时替换为 Stripe API 调用
  return {
    url: `https://checkout.stripe.com/pay/cs_test_${userId}_${Date.now()}`,
  };
}

/**
 * 取消订阅（模拟）
 * @param {string} userId - 用户 ID
 * @returns {Promise<{ success: boolean }>}
 */
export async function cancelSubscription(
  userId: string
): Promise<{ success: boolean }> {
  // 实际集成时替换为 Stripe API 调用
  console.log(`Cancelling subscription for user: ${userId}`);
  return { success: true };
}
