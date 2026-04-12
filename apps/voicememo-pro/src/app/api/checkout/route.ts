import { NextRequest, NextResponse } from "next/server";
import { getStripeInstance } from "@/lib/stripe";

/**
 * @route POST /api/checkout
 * @description 创建 Stripe Checkout Session
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = await getStripeInstance();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe 未配置" },
        { status: 500 }
      );
    }

    const { priceId } = await request.json();
    if (!priceId) {
      return NextResponse.json(
        { error: "缺少 priceId 参数" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/settings?payment=success`,
      cancel_url: `${origin}/pricing?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "创建支付会话失败",
      },
      { status: 500 }
    );
  }
}
