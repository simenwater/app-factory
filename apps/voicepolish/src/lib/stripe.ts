import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

/**
 * @function getStripe
 * 获取 Stripe SDK 实例（延迟初始化，避免构建时报错）
 * @returns {Stripe} Stripe 实例
 */
export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-02-25.clover",
    });
  }
  return stripeInstance;
}

/**
 * @constant PLANS
 * 订阅方案配置
 */
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    minutesLimit: 30,
    features: [
      "每月 30 分钟免费转录",
      "AI 润色（基础格式）",
      "摘要与邮件格式",
      "历史记录保存 7 天",
    ],
  },
  pro: {
    name: "Pro",
    price: 5,
    minutesLimit: 600,
    features: [
      "每月 600 分钟转录",
      "AI 润色（全部格式）",
      "博客、推文、会议纪要",
      "历史记录永久保存",
      "优先处理",
      "批量导出",
    ],
  },
} as const;
