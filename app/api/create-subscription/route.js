import { NextResponse } from 'next/server';
import { createOrder, getRazorpayConfig, SUBSCRIPTION_PRICE } from '@/services/razorpay';
import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const { userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await createOrder(SUBSCRIPTION_PRICE);

    // Create subscription record
    await db.subscription.create({
      data: {
        userId,
        status: 'pending',
        planType: 'premium',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        razorpayOrderId: order.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      keyId: getRazorpayConfig().key_id,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 