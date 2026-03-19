import Stripe from "stripe";

/**
 * @constant PLAN_PRICE_MAP
 * 订阅方案与Stripe价格的映射
 */
export const PLAN_PRICE_MAP: Record<
  string,
  { priceId: string; mode: "subscription" | "payment" }
> = {
  "pro-monthly": {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
    mode: "subscription",
  },
  "pro-yearly": {
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    mode: "subscription",
  },
};

/**
 * 获取Stripe客户端实例
 * @returns {Stripe | null} Stripe客户端实例，未配置时返回null
 */
export function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  return new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
    typescript: true,
  });
}

/**
 * @interface CheckoutSessionParams
 * 创建Checkout Session的参数
 */
export interface CheckoutSessionParams {
  planId: string;
  email?: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * @interface CheckoutSessionResult
 * Checkout Session创建结果
 */
export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

/**
 * 创建Stripe Checkout Session用于订阅支付
 * @param {CheckoutSessionParams} params - 参数
 * @returns {Promise<CheckoutSessionResult>} Session信息
 */
export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<CheckoutSessionResult> {
  const stripe = getStripeClient();
  if (!stripe) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY env var.");
  }

  const planConfig = PLAN_PRICE_MAP[params.planId];
  if (!planConfig || !planConfig.priceId) {
    throw new Error(`Invalid plan or missing price ID for: ${params.planId}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: planConfig.mode,
    payment_method_types: ["card"],
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    customer_email: params.email || undefined,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      planId: params.planId,
    },
  });

  return {
    sessionId: session.id,
    url: session.url || "",
  };
}

/**
 * 验证Stripe Webhook签名
 * @param {string} payload - 原始请求体
 * @param {string} signature - Stripe签名头
 * @returns {Stripe.Event} 验证后的事件对象
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): Stripe.Event {
  const stripe = getStripeClient();
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
