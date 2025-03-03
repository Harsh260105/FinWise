"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [error, setError] = useState(null);
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  // Check if already subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      if (!userId) return;

      try {
        const response = await fetch("/api/check-subscription");
        const data = await response.json();

        if (data.isSubscribed) {
          // If already subscribed, redirect to dashboard
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        setError(
          "Failed to check subscription status. Please refresh the page."
        );
      } finally {
        setCheckingSubscription(false);
      }
    };

    if (isLoaded && userId) {
      checkSubscription();
    } else if (isLoaded) {
      setCheckingSubscription(false);
    }
  }, [isLoaded, userId, router]);

  const activateSubscription = async (paymentDetails) => {
    try {
      const response = await fetch("/api/direct-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          paymentDetails,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push("/dashboard");
      } else {
        throw new Error(data.error || "Failed to activate subscription");
      }
    } catch (error) {
      console.error("Subscription activation error:", error);
      setError(
        error.message ||
          "Failed to activate subscription. Please contact support."
      );
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user ID from Clerk if available
      const userId = user?.id || "guest-user";

      console.log("Creating order for user:", userId);
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.id) {
        console.error("Order creation failed:", orderData);
        throw new Error(orderData.details || "Failed to create order");
      }

      console.log("Order created successfully:", orderData);

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Razorpay script loaded");

        // Configure Razorpay options
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Welth Finance",
          description: "Premium Subscription",
          order_id: orderData.id,
          handler: async function (response) {
            console.log("Payment successful:", response);
            try {
              // Directly activate subscription instead of verifying payment
              await activateSubscription({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });
            } catch (err) {
              console.error("Activation error:", err);
              setError(
                "Failed to activate subscription. Please contact support."
              );
              setLoading(false);
            }
          },
          prefill: {
            name: user?.fullName || "",
            email: user?.primaryEmailAddress?.emailAddress || "",
          },
          theme: {
            color: "#3B82F6",
          },
        };

        try {
          const razorpay = new window.Razorpay(options);
          razorpay.on("payment.failed", function (response) {
            console.error("Payment failed:", response.error);
            setError(`Payment failed: ${response.error.description}`);
            setLoading(false);
          });
          razorpay.open();
        } catch (err) {
          console.error("Razorpay initialization error:", err);
          setError("Failed to initialize payment. Please try again.");
          setLoading(false);
        }
      };

      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        setError("Failed to load payment gateway. Please try again.");
        setLoading(false);
      };
    } catch (error) {
      console.error("Payment setup error:", error);
      setError(error.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Rest of your component code remains the same
  if (checkingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Subscribe to Welth Premium
        </h1>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              Premium Plan
            </h2>
            <div className="text-3xl font-bold text-center mb-6">
              ₹999
              <span className="text-sm text-gray-500">/year</span>
            </div>
            <ul className="space-y-3 mb-6">
              {[
                "Unlimited Transactions",
                "Budget Planning",
                "Investment Tracking",
                "Premium Support",
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
