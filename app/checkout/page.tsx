"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface AddressForm {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
}

type AddressFieldErrors = Partial<Record<keyof AddressForm, string>>;

interface PinLookupResponse {
  Status: string;
  PostOffice?: Array<{
    Name: string;
    District: string;
    State: string;
  }>;
}

interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [errors, setErrors] = useState<AddressFieldErrors>({});
  const [district, setDistrict] = useState("");
  const [isPinLookupLoading, setIsPinLookupLoading] = useState(false);
  const [pinLookupMessage, setPinLookupMessage] = useState("");

  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
  });

  const shipping = subtotal > 1199 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    let isMounted = true;
    let script: HTMLScriptElement | null = null;

    const initializeCheckout = async () => {
      try {
        const authResponse = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "include",
        });

        if (!authResponse.ok) {
          router.push("/auth?callbackUrl=/checkout");
          return;
        }

        const authData = await authResponse.json();
        if (!isMounted || !authData?.user) {
          return;
        }

        setUser(authData.user);

        if (authData.user.name) {
          setAddress((prev) => ({ ...prev, fullName: authData.user.name }));
        }
      } catch (error) {
        router.push("/auth?callbackUrl=/checkout");
      } finally {
        if (isMounted) {
          setAuthChecked(true);
        }
      }
    };

    if (items.length === 0) {
      router.push("/cart");
      return;
    }

    initializeCheckout();

    // Load Razorpay script
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (!existingScript) {
      script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      isMounted = false;

      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [items, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === "pinCode" || name === "phone") {
      value = value.replace(/\D/g, "");
    }

    setAddress((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (name === "pinCode") {
      setPinLookupMessage("");
      setDistrict("");
    }
  };

  useEffect(() => {
    const pinCode = address.pinCode.trim();

    if (pinCode.length !== 6) {
      setIsPinLookupLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(pinCode)) {
      setPinLookupMessage("PIN code must be exactly 6 digits");
      return;
    }

    let cancelled = false;

    const fetchPinDetails = async () => {
      setIsPinLookupLoading(true);
      setPinLookupMessage("");

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pinCode}`
        );
        const data = (await response.json()) as PinLookupResponse[];
        const result = Array.isArray(data) ? data[0] : null;
        const postOffice = result?.PostOffice?.[0];

        if (!postOffice || result?.Status !== "Success") {
          if (!cancelled) {
            setPinLookupMessage("Could not auto-fetch city/state for this PIN code");
          }
          return;
        }

        if (cancelled) {
          return;
        }

        setAddress((prev) => ({
          ...prev,
          city: postOffice.Name || prev.city,
          state: postOffice.State || prev.state,
        }));
        setDistrict(postOffice.District || "");
        setPinLookupMessage("City/state auto-filled from PIN code");
      } catch {
        if (!cancelled) {
          setPinLookupMessage("Unable to fetch location from PIN code right now");
        }
      } finally {
        if (!cancelled) {
          setIsPinLookupLoading(false);
        }
      }
    };

    fetchPinDetails();

    return () => {
      cancelled = true;
    };
  }, [address.pinCode]);

  const getAddressErrors = (): AddressFieldErrors => {
    const nextErrors: AddressFieldErrors = {};

    if (!address.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    }

    if (!address.addressLine1.trim()) {
      nextErrors.addressLine1 = "Address line 1 is required";
    }

    if (!address.city.trim()) {
      nextErrors.city = "City is required";
    } else if (!/^[A-Za-z][A-Za-z .-]{1,49}$/.test(address.city.trim())) {
      nextErrors.city = "Enter a valid city name";
    }

    if (!address.state.trim()) {
      nextErrors.state = "State is required";
    } else if (!/^[A-Za-z][A-Za-z .-]{1,49}$/.test(address.state.trim())) {
      nextErrors.state = "Enter a valid state name";
    }

    if (!address.pinCode.trim()) {
      nextErrors.pinCode = "PIN code is required";
    } else if (!/^\d{6}$/.test(address.pinCode.trim())) {
      nextErrors.pinCode = "PIN code must be exactly 6 digits";
    }

    if (!address.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
      nextErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }

    return nextErrors;
  };

  const validateAddress = () => {
    const nextErrors = getAddressErrors();
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateAddress()) {
      alert("Please fill in all required address fields.");
      return;
    }

    if (!user) {
      alert("Please log in to continue.");
      router.push("/auth");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId, // Use productId instead of id
          title: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
        })),
        address,
        subtotal,
        shipping,
        total,
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        // Handle stock validation errors
        if (data.error === "Insufficient stock") {
          alert(
            `Some items in your cart are out of stock:\n${data.message}\n\nPlease update your cart and try again.`
          );
          router.push("/cart");
          return;
        }

        alert(data.error || "Failed to create order");
        setIsLoading(false);
        return;
      }

      if (typeof window === "undefined" || !window.Razorpay) {
        alert("Payment system is still loading. Please try again in a moment.");
        return;
      }

      // If successful, proceed with payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Yugantar",
        description: "T-Shirt Order Payment",
        order_id: data.order.id,
        handler: function (response: any) {
          // Payment successful
          handlePaymentSuccess(response, data.orderId);
        },
        modal: {
          ondismiss: function () {
            // Payment cancelled or failed
            handlePaymentFailure();
          },
        },
        prefill: {
          name: address.fullName,
          email: user.email || "",
          contact: address.phone,
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (
    paymentResponse: any,
    orderId: string
  ) => {
    try {
      // Verify payment on server
      const verifyResponse = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          orderId,
        }),
      });

      const verifyData = await verifyResponse.json().catch(() => ({}));

      if (verifyResponse.ok && verifyData.success) {
        // Clear cart and redirect to orders page
        clearCart();
        window.location.href = "/orders";
      } else {
        router.push(`/payment?status=failed&orderId=${orderId}`);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      router.push(`/payment?status=failed&orderId=${orderId}`);
    }
  };

  const handlePaymentFailure = () => {
    router.push("/payment?status=failed");
  };

  if (!user || items.length === 0) {
    if (!authChecked || items.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50  flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 ">Preparing checkout...</p>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50  transition-colors">
      <SiteHeader />

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/cart"
            className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
          <div className="w-[120px]" aria-hidden="true" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Form */}
          <Card className="bg-white  border-gray-200 ">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Delivery Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.fullName ? (
                    <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                  ) : null}
                </div>

              <div>
                <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleInputChange}
                    placeholder="House number, street name"
                    required
                  />
                  {errors.addressLine1 ? (
                    <p className="mt-1 text-xs text-red-600">{errors.addressLine1}</p>
                  ) : null}
                </div>

              <div>
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input
                  id="addressLine2"
                  name="addressLine2"
                  value={address.addressLine2}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                  {errors.city ? (
                    <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                  />
                  {errors.state ? (
                    <p className="mt-1 text-xs text-red-600">{errors.state}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pinCode">PIN Code *</Label>
                  <Input
                    id="pinCode"
                    name="pinCode"
                    value={address.pinCode}
                    onChange={handleInputChange}
                    placeholder="PIN Code"
                    inputMode="numeric"
                    maxLength={6}
                    required
                  />
                  {errors.pinCode ? (
                    <p className="mt-1 text-xs text-red-600">{errors.pinCode}</p>
                  ) : null}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    inputMode="numeric"
                    maxLength={10}
                    required
                  />
                  {errors.phone ? (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={district}
                    placeholder="Auto-filled from PIN code"
                    readOnly
                  />
                </div>
                <div className="flex items-end">
                  <p className="text-xs text-gray-500">
                    {isPinLookupLoading
                      ? "Fetching location from PIN code..."
                      : pinLookupMessage}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-white  border-gray-200 ">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-12 h-12 bg-gray-100  rounded-md"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 " />

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <hr className="border-gray-200 " />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isLoading || !validateAddress()}
                className="w-full bg-gray-900 hover:bg-gray-800"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{total.toFixed(2)}</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
