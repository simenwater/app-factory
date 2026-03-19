import { NextResponse } from "next/server";
import { createCheckoutSession, getStripeClient } from "@/lib/stripe";

/**
 * @interface CheckoutRequest
 * 创建支付会话的请求体
 */
interface CheckoutRequest {
  planId: string;
  email?: string;
}

/**
 * POST /api/checkout
 * 创建Stripe Checkout Session并返回支付页面URL
 */
export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();

    if (!body.planId) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    if (body.planId === "free") {
      return NextResponse.json({
        success: true,
        free: true,
        message: "Free plan activated",
      });
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        {
          error: "Payment system is being configured. Please try again later.",
          code: "STRIPE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const origin = new URL(request.url).origin;

    const session = await createCheckoutSession({
      planId: body.planId,
      email: body.email,
      successUrl: `${origin}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/pricing?canceled=true`,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Payment processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
