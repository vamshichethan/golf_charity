import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Removed Stripe for direct subscription testing
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

    if (!tier) {
      return NextResponse.json(
        { error: "Invalid subscription tier." },
        { status: 400 }
      );
    }

    // Mock direct subscription (Setting role to member or similar if needed)
    // In a real app without Stripe, you'd just update the database here.
    const { error: updateError } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        status: "active",
        plan: tier,
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (updateError) {
      return NextResponse.json({ error: "Failed to update subscription." }, { status: 500 });
    }

    // Redirect to dashboard
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?subscription=active`;
    return NextResponse.json({ url: dashboardUrl });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription." },
      { status: 500 }
    );
  }
}
