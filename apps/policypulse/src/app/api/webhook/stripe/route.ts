import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/stripe";

/**
 * POST /api/webhook/stripe
 * Stripe Webhook处理器 — 处理支付成功、订阅变更等事件
 */
export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const event = verifyWebhookSignature(payload, signature);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const planId = session.metadata?.planId;
        const customerEmail = session.customer_email;

        console.log(
          `[Stripe] Checkout completed: plan=${planId}, email=${customerEmail}`
        );
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        console.log(
          `[Stripe] Subscription updated: ${subscription.id}, status=${subscription.status}`
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log(
          `[Stripe] Subscription canceled: ${subscription.id}`
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.log(
          `[Stripe] Payment failed: invoice=${invoice.id}`
        );
        break;
      }

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
