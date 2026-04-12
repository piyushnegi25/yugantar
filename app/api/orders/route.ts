import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { getUserFromToken } from "@/lib/auth";
import { restoreStock } from "@/lib/stock-utils";

export const dynamic = "force-dynamic";

const ORDER_STATUSES = new Set([
  "placed",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

async function getAuthenticatedUser(request: NextRequest) {
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

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    await connectDB();

    let orders;
    if (isAdmin) {
      if (authResult.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Admin access required" },
          { status: 403 }
        );
      }

      // Admin gets all orders
      orders = await Order.find({}).sort({ createdAt: -1 }).exec();
    } else {
      // User gets their own orders
      orders = await Order.find({ userId: authResult._id.toString() })
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
    const authResult = await getAuthenticatedUser(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    if (authResult.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
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

    const updatePayload: Record<string, unknown> = { orderStatus };
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

      updatePayload.cancelReason = "Cancelled by admin";
      updatePayload.cancelledAt = new Date();
    }

    const order = await Order.findOneAndUpdate({ orderId }, updatePayload, {
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
