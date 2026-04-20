import { NextRequest, NextResponse } from 'next/server';

/**
 * @description Stripe Webhook 处理端点
 * @param request - Stripe 发送的 webhook 事件
 * @returns 处理结果
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: '缺少签名' }, { status: 400 });
    }

    /* Stripe Webhook 验证占位 — 实际部署时取消注释
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        // 处理成功支付
        break;
      case 'customer.subscription.deleted':
        // 处理取消订阅
        break;
      default:
        console.log(`未处理的事件类型: ${event.type}`);
    }
    */

    console.log('Webhook received:', body.substring(0, 100));

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook 处理失败' },
      { status: 500 }
    );
  }
}
