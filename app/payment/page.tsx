"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");
  const [countdown, setCountdown] = useState(5);

  const isFailure = status === "failed";

  useEffect(() => {
    if (isFailure) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/cart");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [router, isFailure]);

  return (
    <div className="min-h-screen bg-gray-50  transition-colors">
      <SiteHeader />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="bg-white  border-gray-200  text-center">
          <CardContent className="p-8">
            {isFailure ? (
              <>
                <div className="flex justify-center mb-6">
                  <XCircle className="w-16 h-16 text-red-500" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900  mb-4">
                  Payment Failed
                </h1>

                <p className="text-gray-600  mb-6">
                  We're sorry, but your payment could not be processed. Please
                  try again.
                </p>

                {orderId && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <p className="text-sm font-medium text-red-800 ">
                        Order ID: {orderId}
                      </p>
                    </div>
                    <p className="text-sm text-red-600 ">
                      This order has been marked as failed. You can try placing
                      the order again.
                    </p>
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <p className="text-sm text-gray-500 ">
                    Common reasons for payment failure:
                  </p>
                  <ul className="text-sm text-gray-600  space-y-1">
                    <li>• Insufficient funds in your account</li>
                    <li>• Network connectivity issues</li>
                    <li>• Bank server maintenance</li>
                    <li>• Payment method restrictions</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600 ">
                    Redirecting to cart in {countdown} seconds...
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/checkout">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 sm:w-auto">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                      </Button>
                    </Link>

                    <Link href="/cart">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Cart
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900  mb-4">
                  Payment Status
                </h1>
                <p className="text-gray-600 ">
                  Checking payment status...
                </p>
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mt-4"></div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50  flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
