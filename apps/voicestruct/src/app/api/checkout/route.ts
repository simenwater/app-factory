import { NextRequest, NextResponse } from "next/server";

/**
 * @description Stripe Checkout 会话创建端点
 * 根据用户选择的订阅计划创建 Stripe Checkout 会话
 * @param {NextRequest} request - 包含 plan 参数的请求
 * @returns {NextResponse} Checkout URL 或错误信息
 */
export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe 未配置" },
        { status: 500 }
      );
    }

    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_PRICE_YEARLY
        : process.env.STRIPE_PRICE_MONTHLY;

    if (!priceId) {
      return NextResponse.json(
        { error: "价格 ID 未配置" },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${appUrl}/settings?upgrade=success`);
    params.append("cancel_url", `${appUrl}/settings?upgrade=cancel`);

    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(stripeKey + ":").toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error?.error?.message || "创建订阅会话失败" },
        { status: response.status }
      );
    }

    const session = await response.json();
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "创建订阅会话时发生错误" },
      { status: 500 }
    );
  }
}
