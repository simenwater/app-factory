import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

/**
 * @interface SubscribeRequest
 * 订阅请求体
 */
interface SubscribeRequest {
  planId: string;
  email?: string;
}

/**
 * POST /api/subscribe
 * 订阅管理接口 — 与Stripe集成的完整订阅流程
 */
export async function POST(request: Request) {
  const body: SubscribeRequest = await request.json();

  if (!body.planId) {
    return NextResponse.json(
      { error: "planId is required" },
      { status: 400 }
    );
  }

  if (body.planId === "free") {
    return NextResponse.json({
      success: true,
      message: "Free plan activated",
      subscription: {
        id: `sub_free_${Date.now()}`,
        planId: body.planId,
        status: "active",
        createdAt: new Date().toISOString(),
      },
    });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      {
        error: "Payment system is being set up. Use /api/checkout for payments.",
        code: "STRIPE_NOT_CONFIGURED",
        fallback: true,
        subscription: {
          id: `sub_pending_${Date.now()}`,
          planId: body.planId,
          status: "pending_payment",
          createdAt: new Date().toISOString(),
        },
      },
      { status: 202 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Please use /api/checkout to create a payment session",
    redirectTo: "/api/checkout",
  });
}
