import { auth, clerkClient } from "@clerk/nextjs/server";
import { createHmac } from "crypto";

export async function POST(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Verify signature if provided
    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generated_signature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        return Response.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    // Update user metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        isSubscribed: true,
        subscriptionDate: new Date().toISOString(),
        paymentId: razorpay_payment_id || null
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error activating subscription:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 