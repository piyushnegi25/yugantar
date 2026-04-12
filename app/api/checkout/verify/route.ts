import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { reduceStock } from "@/lib/stock-utils";
import { NextRequest } from "next/server";
import { getUserFromToken } from "@/lib/auth";

function isSignatureValid(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expected.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid authentication" },
        { status: 401 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await request.json();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return NextResponse.json(
        { success: false, error: "Missing payment verification details" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Payment gateway configuration missing" },
        { status: 500 }
      );
    }

    await connectDB();

    const order = await Order.findOne({
      orderId,
      userId: user._id.toString(),
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.orderStatus === "cancelled") {
      return NextResponse.json(
        { success: false, error: "Order has already been cancelled" },
        { status: 400 }
      );
    }

    if (order.payment.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json(
        { success: false, error: "Payment order mismatch" },
        { status: 400 }
      );
    }

    if (order.payment.status === "completed") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
        stockReduced: true,
        stockErrors: [],
      });
    }

    // Verify signature
    const isAuthentic = isSignatureValid(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );

    if (isAuthentic) {
      // Reduce stock quantities for all items in the order
      const stockReduction = await reduceStock(order.items);
      if (!stockReduction.success) {
        console.error("Stock reduction errors:", stockReduction.errors);
      }

      // Update order with payment details
      await Order.findOneAndUpdate(
        { orderId, userId: user._id.toString() },
        {
          "payment.razorpayPaymentId": razorpay_payment_id,
          "payment.razorpaySignature": razorpay_signature,
          "payment.status": "completed",
          orderStatus: "confirmed",
        }
      );

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        stockReduced: stockReduction.success,
        stockErrors: stockReduction.errors,
      });
    } else {
      // Update order as failed
      await Order.findOneAndUpdate(
        { orderId, userId: user._id.toString() },
        {
          "payment.status": "failed",
        }
      );

      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
