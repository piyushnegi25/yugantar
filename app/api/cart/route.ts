import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cart, { type ICartItem } from "@/lib/models/Cart";
import { getUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/cart - Get cart items
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    // Get user from token if available
    const token = request.cookies.get("auth_token")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const user = await getUserFromToken(token);
        userId = user?._id.toString() || null;
      } catch (error) {
        // Token invalid, continue as guest
      }
    }

    let cart = null;

    if (userId) {
      // Look for user cart first
      cart = await Cart.findOne({ userId });

      // If user has no cart but has session cart, migrate it
      if (!cart && sessionId) {
        const sessionCart = await Cart.findOne({ sessionId });
        if (sessionCart) {
          sessionCart.userId = userId;
          sessionCart.sessionId = null;
          await sessionCart.save();
          cart = sessionCart;
        }
      }
    } else if (sessionId) {
      // Guest user
      cart = await Cart.findOne({ sessionId });
    }

    return NextResponse.json({
      items: cart?.items || [],
      totalItems:
        cart?.items.reduce(
          (sum: number, item: ICartItem) => sum + item.quantity,
          0
        ) || 0,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST /api/cart - Update cart items
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { items, sessionId }: { items: ICartItem[]; sessionId: string } =
      body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid cart items payload" },
        { status: 400 }
      );
    }

    if (
      items.some(
        (item) =>
          !item ||
          typeof item.productId !== "string" ||
          !item.productId.trim() ||
          typeof item.name !== "string" ||
          !item.name.trim() ||
          typeof item.size !== "string" ||
          !item.size.trim() ||
          typeof item.color !== "string" ||
          !item.color.trim() ||
          !Number.isFinite(Number(item.price)) ||
          Number(item.price) < 0 ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) <= 0 ||
          Number(item.quantity) > 20
      )
    ) {
      return NextResponse.json(
        { error: "Invalid cart item values" },
        { status: 400 }
      );
    }

    // Get user from token if available
    const token = request.cookies.get("auth_token")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const user = await getUserFromToken(token);
        userId = user?._id.toString() || null;
      } catch (error) {
        // Token invalid, continue as guest
      }
    }

    let cart = null;

    if (userId) {
      // Find or create user cart
      cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      // Migrate session cart if exists
      if (sessionId) {
        const sessionCart = await Cart.findOne({ sessionId });
        if (sessionCart && !cart.items.length) {
          cart.items = sessionCart.items;
          await Cart.deleteOne({ sessionId });
        }
      }
    } else if (sessionId) {
      // Guest user
      cart = await Cart.findOne({ sessionId });
      if (!cart) {
        cart = new Cart({ sessionId, items: [] });
      }
    } else {
      return NextResponse.json(
        { error: "No session ID provided" },
        { status: 400 }
      );
    }

    // Update cart items
    cart.items = items;
    await cart.save();

    return NextResponse.json({
      success: true,
      items: cart.items,
      totalItems: cart.items.reduce(
        (sum: number, item: ICartItem) => sum + item.quantity,
        0
      ),
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    // Get user from token if available
    const token = request.cookies.get("auth_token")?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const user = await getUserFromToken(token);
        userId = user?._id.toString() || null;
      } catch (error) {
        // Token invalid, continue as guest
      }
    }

    if (userId) {
      await Cart.findOneAndUpdate({ userId }, { items: [] });
    } else if (sessionId) {
      await Cart.findOneAndUpdate({ sessionId }, { items: [] });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
