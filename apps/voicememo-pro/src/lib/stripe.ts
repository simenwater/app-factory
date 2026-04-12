/**
 * @description Stripe 支付集成工具
 */

/**
 * @interface PricingPlan
 * 定价方案
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  priceId?: string;
  popular?: boolean;
}

/** @constant PRICING_PLANS - 产品定价方案 */
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "免费版",
    price: "$0",
    period: "永久",
    features: [
      "每月 10 分钟转录额度",
      "基础 AI 重写",
      "3 种语气风格",
      "通用文本格式",
    ],
  },
  {
    id: "monthly",
    name: "专业版",
    price: "$9.9",
    period: "/月",
    popular: true,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID,
    features: [
      "每月 500 分钟转录额度",
      "高级 AI 重写",
      "全部语气风格",
      "全部平台格式",
      "历史记录无限保存",
      "优先客服支持",
    ],
  },
  {
    id: "lifetime",
    name: "买断版",
    price: "$49.9",
    period: "一次性",
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID,
    features: [
      "本地处理，无限使用",
      "全部专业版功能",
      "永久更新",
      "优先新功能体验",
    ],
  },
];

/**
 * @function getStripeInstance
 * @description 延迟加载 Stripe 实例（仅服务端）
 * @returns {Promise<import('stripe').default | null>} Stripe 实例
 */
export async function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  const Stripe = (await import("stripe")).default;
  return new Stripe(secretKey);
}
