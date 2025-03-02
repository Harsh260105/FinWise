import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const SUBSCRIPTION_PRICE = 999; // ₹999 for premium plan

export async function createOrder(amount) {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      payment_capture: 1,
    });
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

export async function verifyPayment(paymentId, orderId, signature) {
  const body = orderId + "|" + paymentId;
  
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
}

export function getRazorpayConfig() {
  return {
    key_id: process.env.RAZORPAY_KEY_ID,
  };
} 