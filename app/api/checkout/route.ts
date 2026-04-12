import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { validateStock } from "@/lib/stock-utils";
import { v4 as uuidv4 } from "uuid";
import { getUserFromToken } from "@/lib/auth";

interface CheckoutItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

function normalizeItems(items: unknown): CheckoutItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => ({
    productId: String(item?.productId || "").trim(),
    title: String(item?.title || "").trim(),
    price: Number(item?.price),
    quantity: Number(item?.quantity),
    size: String(item?.size || "").trim(),
    image: String(item?.image || "").trim(),
  }));
}

function hasValidItems(items: CheckoutItem[]) {
  if (!items.length) {
    return false;
  }

  return items.every(
    (item) =>
      !!item.productId &&
      !!item.title &&
      !!item.size &&
      !!item.image &&
      Number.isFinite(item.price) &&
      item.price >= 0 &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
  );
}

function hasValidAddress(address: unknown) {
  if (!address || typeof address !== "object") {
    return false;
  }

  const addressRecord = address as Record<string, unknown>;

  const requiredFields = [
    "fullName",
    "addressLine1",
    "city",
    "state",
    "pinCode",
    "phone",
  ];

  return requiredFields.every((field) => {
    const value = addressRecord[field];
    return typeof value === "string" && value.trim().length > 0;
  });
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

    const { items, address } = await request.json();
    const normalizedItems = normalizeItems(items);

    if (!hasValidItems(normalizedItems)) {
      return NextResponse.json(
        { success: false, error: "Invalid order items" },
        { status: 400 }
      );
    }

    if (!hasValidAddress(address)) {
      return NextResponse.json(
        { success: false, error: "Invalid delivery address" },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, error: "Payment gateway configuration missing" },
        { status: 500 }
      );
    }

    await connectDB();

    const subtotal = Number(
      normalizedItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2)
    );
    const shipping = subtotal > 1199 ? 0 : 99;
    const total = Number((subtotal + shipping).toFixed(2));

    // Validate stock availability before creating order
    const stockValidation = await validateStock(normalizedItems);
    if (!stockValidation.valid) {
      const outOfStockDetails = stockValidation.outOfStockItems
        .map(
          (item) =>
            `Product ${item.productId} (Size: ${item.size}) - Requested: ${item.requestedQty}, Available: ${item.availableQty}`
        )
        .join(", ");

      return NextResponse.json(
        {
          success: false,
          error: "Insufficient stock",
          details:
            "Some items in your cart are out of stock or have insufficient quantity",
          outOfStockItems: stockValidation.outOfStockItems,
          message: `Out of stock: ${outOfStockDetails}`,
        },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: Math.round(total * 100), // Convert to smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create order in database
    const order = new Order({
      userId: user._id.toString(),
      orderId,
      items: normalizedItems,
      address,
      payment: {
        razorpayOrderId: razorpayOrder.id,
        amount: total,
        currency: "INR",
        status: "pending",
      },
      orderStatus: "placed",
      subtotal,
      shipping,
      total,
    });

    await order.save();

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      orderId,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
