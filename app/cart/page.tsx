"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowLeft,
  Truck,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { SiteHeader } from "@/components/site-header";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    isLoading,
  } = useCart();

  const shipping = subtotal > 1199 ? 0 : 99; // Free shipping over ₹1199, else ₹99
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 ">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50  transition-colors">
      <SiteHeader />

      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Shopping Cart
          </Badge>
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          // Empty Cart
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300  mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900  mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600  mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/">
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800"
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 ">
                  Shopping Cart ({items.length}{" "}
                  {items.length === 1 ? "item" : "items"})
                </h1>
                <Button
                  onClick={clearCart}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>

              {items.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white  border-gray-200 "
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 bg-gray-100  rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 ">
                              {item.name}
                            </h3>
                            {item.category && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {item.category}
                              </Badge>
                            )}
                            <div className="mt-2 text-sm text-gray-600 ">
                              <span>Color: {item.color}</span>
                              <span className="mx-2">•</span>
                              <span>Size: {item.size}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => removeFromCart(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <Button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-gray-900  font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900 ">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500 ">
                              ₹{item.price.toFixed(2)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white  border-gray-200  sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900  mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600 ">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 ">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="border-t border-gray-200  pt-4">
                      <div className="flex justify-between text-lg font-bold text-gray-900 ">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="mt-4 rounded-lg bg-blue-50 p-3">
                      <p className="text-sm text-blue-700 ">
                        Add ₹{(1199 - subtotal).toFixed(2)} more for free
                        shipping!
                      </p>
                    </div>
                  )}

                  <Link href="/checkout">
                    <Button
                      size="lg"
                      className="mt-6 w-full bg-gray-900 hover:bg-gray-800"
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 ">
                      <Truck className="w-4 h-4" />
                      <span>Free shipping on orders over ₹1199</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 ">
                      <Shield className="w-4 h-4" />
                      <span>Money back if order cancelled before 7 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
