import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

/**
 * @description POST /api/stripe/webhook - Handle Stripe webhook events for subscription lifecycle
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId && session.subscription) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: session.subscription as string,
            subscriptionTier: "premium",
            subscriptionStatus: "active",
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: subscription.customer as string },
      });
      if (user) {
        const isActive = ["active", "trialing"].includes(subscription.status);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier: isActive ? "premium" : "free",
            subscriptionStatus: subscription.status,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: subscription.customer as string },
      });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier: "free",
            subscriptionStatus: "canceled",
            stripeSubscriptionId: null,
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
