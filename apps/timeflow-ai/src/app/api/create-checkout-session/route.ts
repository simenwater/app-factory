import { NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * 创建 Stripe Checkout Session
 */
export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePriceId = process.env.STRIPE_PRICE_ID;
    
    if (!stripeSecretKey || !stripePriceId) {
      return NextResponse.json(
        { 
          error: 'Stripe 未配置，请联系管理员',
          demoUrl: 'https://buy.stripe.com/test_demo_link'
        },
        { status: 200 }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-02-25.clover',
    });
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin')}/`,
      client_reference_id: userId,
      customer_email: undefined,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('创建 Stripe Checkout Session 失败:', error);
    return NextResponse.json(
      { 
        error: '创建支付会话失败',
        demoUrl: 'https://buy.stripe.com/test_demo_link'
      },
      { status: 500 }
    );
  }
}
