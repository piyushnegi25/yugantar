"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Redirect to orders page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/orders");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50  flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100  rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 " />
          </div>
          <CardTitle className="text-2xl text-gray-900 ">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 ">
            Your order has been placed successfully.
            {orderId && (
              <>
                <br />
                Order ID: <span className="font-semibold">{orderId}</span>
              </>
            )}
          </p>
          <p className="text-sm text-gray-500 ">
            Redirecting to your orders page in 3 seconds...
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link
                href="/orders"
                className="flex items-center justify-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>View My Orders</span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50  flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
