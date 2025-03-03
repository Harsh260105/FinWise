import Razorpay from "razorpay";
import { nanoid } from "nanoid";

export async function POST() {
    try {
        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Create receipt ID
        const receiptId = 'rcpt_' + nanoid(10);

        // Order options
        const options = {
            amount: 99900, // ₹999 in paise
            currency: 'INR',
            receipt: receiptId,
            payment_capture: 1
        };

        // Create order
        const order = await razorpay.orders.create(options);

        return Response.json({
            success: true,
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return Response.json({
            success: false,
            error: "Failed to create order",
            details: error.message
        }, { status: 500 });
    }
} 