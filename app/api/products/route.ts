import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { getUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const isFeatured = searchParams.get("isFeatured");
    const isActive = searchParams.get("isActive");
    const limitParam = searchParams.get("limit");
    const pageParam = searchParams.get("page");
    const admin = searchParams.get("admin") === "true";

    if (admin) {
      const token = request.cookies.get("auth_token")?.value;
      if (!token) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      const user = await getUserFromToken(token);
      if (!user || user.role !== "admin") {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
    }

    await connectDB();

    const parsedLimit = Number.parseInt(limitParam || "", 10);
    const parsedPage = Number.parseInt(pageParam || "", 10);
    const hasValidLimit = Number.isFinite(parsedLimit) && parsedLimit > 0;
    const hasValidPage = Number.isFinite(parsedPage) && parsedPage > 0;

    // Build filter object
    const filter: any = {};

    if (category) {
      filter.category = { $in: [category] };
    }

    if (isFeatured !== null && isFeatured !== "") {
      filter.isFeatured = isFeatured === "true";
    }

    // For admin requests, include both active and inactive products
    if (admin) {
      // Don't filter by isActive for admin requests
    } else if (isActive !== null && isActive !== "") {
      filter.isActive = isActive === "true";
    } else {
      // Default to only active products unless explicitly requested
      filter.isActive = true;
    }

    // Build query
    let query = Product.find(filter).sort({ createdAt: -1 });

    // Apply pagination if specified
    if (hasValidLimit) {
      query = query.limit(parsedLimit);
    }

    if (hasValidPage && hasValidLimit) {
      const skip = (parsedPage - 1) * parsedLimit;
      query = query.skip(skip);
    }

    const products = await query.exec();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    return NextResponse.json(
      {
        products,
        total,
        page: hasValidPage ? parsedPage : 1,
        limit: hasValidLimit ? parsedLimit : products.length,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
