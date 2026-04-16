import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { restoreStock } from "@/lib/stock-utils";
import {
  requireAdminUser,
  requireAuthenticatedUser,
} from "@/lib/security/auth-guards";

export const dynamic = "force-dynamic";

const ORDER_STATUSES = new Set([
  "placed",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthenticatedUser(request);
    if (auth.error) {
      return auth.error;
    }

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    await connectDB();

    let orders;
    if (isAdmin) {
      if (auth.user.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Admin access required" },
          { status: 403 }
        );
      }

      orders = await Order.find({}).sort({ createdAt: -1 }).exec();
    } else {
      orders = await Order.find({ userId: auth.user._id.toString() })
        .sort({ createdAt: -1 })
        .exec();
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.error) {
      return auth.error;
    }

    const { orderId, orderStatus } = await request.json();

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    if (!ORDER_STATUSES.has(orderStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid order status" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingOrder = await Order.findOne({ orderId });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    if (
      existingOrder.orderStatus === "cancelled" &&
      orderStatus !== "cancelled"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Cancelled orders cannot be moved to a different status",
        },
        { status: 400 }
      );
    }

    const setPayload: Record<string, unknown> = {
      orderStatus,
    };
    const unsetPayload: Record<string, 1> = {};
    let stockRestored = false;
    let stockErrors: string[] = [];

    if (orderStatus === "cancelled" && existingOrder.orderStatus !== "cancelled") {
      if (
        existingOrder.orderStatus === "shipped" ||
        existingOrder.orderStatus === "delivered"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Cannot cancel an order that is shipped or delivered",
          },
          { status: 400 }
        );
      }

      if (
        existingOrder.payment.status === "completed" &&
        existingOrder.orderStatus === "confirmed"
      ) {
        const stockRestoration = await restoreStock(existingOrder.items);
        stockRestored = stockRestoration.success;
        stockErrors = stockRestoration.errors;

        if (!stockRestoration.success) {
          console.error("Stock restoration errors:", stockRestoration.errors);
        }
      }

      setPayload.cancelReason = "Cancelled by admin";
      setPayload.cancelledAt = new Date();
    } else if (orderStatus !== "cancelled") {
      unsetPayload.cancelReason = 1;
      unsetPayload.cancelledAt = 1;
    }

    const query: Record<string, unknown> = {
      orderId,
    };

    if (orderStatus === "cancelled") {
      query.orderStatus = { $in: ["placed", "confirmed"] };
    } else {
      query.orderStatus = { $ne: "cancelled" };
    }

    const updateDoc: {
      $set: Record<string, unknown>;
      $unset?: Record<string, 1>;
    } = {
      $set: setPayload,
    };

    if (Object.keys(unsetPayload).length > 0) {
      updateDoc.$unset = unsetPayload;
    }

    const order = await Order.findOneAndUpdate(query, updateDoc, {
      new: true,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order, stockRestored, stockErrors });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
