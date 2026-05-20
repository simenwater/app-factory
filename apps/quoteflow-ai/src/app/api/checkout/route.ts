import { NextRequest, NextResponse } from "next/server";

/**
 * @description Stripe Checkout 会话创建端点（MVP 存根）
 * 需要配置 STRIPE_SECRET_KEY 和 STRIPE_PRICE_ID 才能实际使用
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!stripeKey || stripeKey === "sk_test_xxx" || !priceId) {
      return NextResponse.json({
        url: `${appUrl}/pricing?demo=true`,
        message: "Stripe not configured. In production, this would redirect to Stripe Checkout.",
      });
    }

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        mode: "subscription",
        success_url: `${appUrl}/settings?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing`,
        ...(email ? { customer_email: email } : {}),
      }),
    });

    const session = await response.json();

    if (session.url) {
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { error: "Checkout error" },
      { status: 500 }
    );
  }
}
