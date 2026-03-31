import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia", // Using latest stable
});

// Configure your Stripe Price IDs here or in .env.local
const PRICE_IDS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || "price_1QuNo9C3186vL3wYToi9L7C9", // Placeholder
  yearly: process.env.STRIPE_YEARLY_PRICE_ID || "price_1QuNpxC3186vL3wYa6Z7j1P3",   // Placeholder
};

export async function POST(req) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to subscribe." },
        { status: 401 }
      );
    }

    const { tier } = await req.json();

    if (!tier || !PRICE_IDS[tier]) {
      return NextResponse.json(
        { error: "Invalid subscription tier." },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICE_IDS[tier],
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}&subscription=active`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        tier: tier,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to initiate checkout. Check your Stripe configuration." },
      { status: 500 }
    );
  }
}

