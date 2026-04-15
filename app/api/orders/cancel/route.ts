import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { restoreStock } from "@/lib/stock-utils";
import { requireAuthenticatedUser } from "@/lib/security/auth-guards";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedUser(request);
    if (auth.error) {
      return auth.error;
    }

    const { orderId, reason } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (auth.user.role !== "admin" && order.userId !== auth.user._id.toString()) {
      return NextResponse.json(
        { success: false, error: "Not authorized to cancel this order" },
        { status: 403 }
      );
    }

    // Check if order can be cancelled
    if (order.orderStatus === "cancelled") {
      return NextResponse.json(
        { success: false, error: "Order is already cancelled" },
        { status: 400 }
      );
    }

    if (order.orderStatus === "shipped" || order.orderStatus === "delivered") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot cancel order that has been shipped or delivered",
        },
        { status: 400 }
      );
    }

    // Only restore stock if payment was completed and order was confirmed
    let stockRestored = false;
    let stockErrors: string[] = [];

    if (
      order.payment.status === "completed" &&
      order.orderStatus === "confirmed"
    ) {
      const stockRestoration = await restoreStock(order.items);
      stockRestored = stockRestoration.success;
      stockErrors = stockRestoration.errors;

      if (!stockRestoration.success) {
        console.error("Stock restoration errors:", stockRestoration.errors);
      }
    }

    // Update order status to cancelled
    await Order.findOneAndUpdate(
      { orderId },
      {
        orderStatus: "cancelled",
        cancelReason: reason || "Customer requested cancellation",
        cancelledAt: new Date(),
      }
    );

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      stockRestored,
      stockErrors,
    });
  } catch (error) {
    console.error("Order cancellation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
