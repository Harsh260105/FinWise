"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SUBSCRIPTION_PRICE } from '@/services/razorpay';

export default function SubscriptionPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      // Create order
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.emailAddresses[0].emailAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { orderId, keyId } = await response.json();

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: SUBSCRIPTION_PRICE * 100,
        currency: "INR",
        name: "FinWise Premium",
        description: "Premium Subscription",
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId: user.id,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            toast.success("Subscription activated successfully!");
            router.push('/dashboard');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error("Failed to verify payment");
          }
        },
        prefill: {
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName,
        },
        theme: {
          color: "#0F172A",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Failed to process subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl pt-8 pb-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upgrade to Premium</h1>
        <p className="text-muted-foreground mt-2">
          Get access to all premium features and personalized investment recommendations
        </p>
      </div>

      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Premium Plan</CardTitle>
          <CardDescription>Everything you need for smart investing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-6">
            ₹{SUBSCRIPTION_PRICE}
            <span className="text-lg text-muted-foreground font-normal">/year</span>
          </div>

          <ul className="space-y-3">
            {[
              "Personalized investment recommendations",
              "Real-time market insights",
              "Portfolio tracking and analysis",
              "Expert financial advice",
              "Priority customer support",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 