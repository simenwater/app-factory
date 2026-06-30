/**
 * @fileoverview Stripe 支付集成模块（仅服务端使用）
 */

import Stripe from 'stripe';
import type { PlanType } from '@/types';
import { PLANS } from './plans';

/** Stripe 客户端 */
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export { PLANS };

/**
 * 创建 Stripe Checkout Session
 * @param {PlanType} plan - 订阅计划
 * @param {'monthly' | 'yearly'} interval - 付费周期
 * @param {string} [customerEmail] - 客户邮箱
 * @returns {Promise<string | null>} Checkout URL
 */
export async function createCheckoutSession(
  plan: PlanType,
  interval: 'monthly' | 'yearly',
  customerEmail?: string
): Promise<string | null> {
  if (!stripe || plan === 'free') return null;

  const planDetails = PLANS[plan];
  const price = interval === 'yearly' ? planDetails.priceYearly : planDetails.price;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `AgentContext ${planDetails.name}`,
            description: planDetails.features.join(', '),
          },
          unit_amount: price * 100,
          recurring: {
            interval: interval === 'yearly' ? 'year' : 'month',
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
  });

  return session.url;
}
