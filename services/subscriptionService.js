import Razorpay from 'razorpay';
import prisma from '../lib/prismadb';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (userId) => {
  try {
    const options = {
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentId, orderId, userId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    
    if (payment.status === 'captured') {
      // Create subscription
      const subscription = await prisma.subscription.create({
        data: {
          userId,
          status: 'active',
          paymentId,
          orderId,
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      // Update user subscription status
      await prisma.user.update({
        where: { id: userId },
        data: { isSubscribed: true },
      });

      return subscription;
    }
    throw new Error('Payment verification failed');
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 