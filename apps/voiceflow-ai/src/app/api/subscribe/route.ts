import { NextRequest, NextResponse } from 'next/server';

/**
 * @description 创建 Stripe Checkout Session 的 API
 * @param request - 包含 priceId 的 JSON 请求
 * @returns Stripe checkout session URL
 */
export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: '缺少价格 ID' }, { status: 400 });
    }

    /* Stripe 集成占位 — 实际部署时取消注释并配置 Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      mode: priceId === process.env.STRIPE_LIFETIME_PRICE_ID ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });
    return NextResponse.json({ url: session.url });
    */

    return NextResponse.json({
      url: '/pricing?success=true',
      message: '演示模式 — Stripe 集成需在生产环境配置',
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: '创建订阅失败' },
      { status: 500 }
    );
  }
}
