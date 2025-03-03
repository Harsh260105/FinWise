<<<<<<< HEAD
 
=======
import { NextResponse } from 'next/server';
import { verifyPayment } from '@/services/razorpay';
import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const { orderId, paymentId, signature, userId } = await req.json();

    if (!orderId || !paymentId || !signature || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify payment signature
    const isValid = await verifyPayment(paymentId, orderId, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update subscription status
    await db.subscription.update({
      where: {
        userId,
        razorpayOrderId: orderId,
      },
      data: {
        status: 'active',
        paymentId,
      },
    });

    // Update user subscription status
    await db.user.update({
      where: { id: userId },
      data: { isSubscribed: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 
>>>>>>> 52cc85a8c0ddd5dc49d18fb18ee4f09d8517490f
