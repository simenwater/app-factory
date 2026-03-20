import Stripe from "stripe";

/**
 * @description Server-side Stripe client instance
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});
