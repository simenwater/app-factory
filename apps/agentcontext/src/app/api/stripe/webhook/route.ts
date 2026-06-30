/**
 * @fileoverview Stripe Webhook 处理路由
 * POST /api/stripe/webhook - 处理 Stripe 事件回调
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

/**
 * 处理 Stripe Webhook 事件
 * @param {NextRequest} request - Webhook 请求
 * @returns {Promise<NextResponse>}
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Payment successful:', session.id);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription cancelled:', subscription.id);
        break;
      }
      default:
        console.log('Unhandled event:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
