import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

/**
 * @route POST /api/webhook/stripe
 * Stripe Webhook 处理订阅事件
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  try {
    const event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("Subscription created:", session.id);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log("Subscription cancelled:", subscription.id);
        break;
      }
      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Webhook 验证失败" },
      { status: 400 }
    );
  }
}
