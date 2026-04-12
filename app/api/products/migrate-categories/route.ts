import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { getUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/products/migrate-categories - Migrate category from string to array
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
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

    await connectDB();

    const body = await request.json();
    const { confirm } = body;

    if (confirm !== "MIGRATE_CATEGORIES") {
      return NextResponse.json(
        { error: "Confirmation required" },
        { status: 400 }
      );
    }

    // Find all products where category is a string (legacy shape)
    const products = await Product.find({
      $expr: { $eq: [{ $type: "$category" }, "string"] },
    });

    console.log(
      `Found ${products.length} products with string categories to migrate`
    );

    let migratedCount = 0;

    for (const product of products) {
      if (typeof product.category === "string") {
        // Convert string category to array
        const categoryArray = [product.category];

        await Product.updateOne(
          { _id: product._id },
          { $set: { category: categoryArray } }
        );

        console.log(
          `Migrated product "${product.name}" - category: "${
            product.category
          }" -> [${categoryArray.join(", ")}]`
        );
        migratedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedCount} products from string to array categories`,
      migratedCount,
      totalChecked: products.length,
    });
  } catch (error) {
    console.error("Error migrating categories:", error);
    return NextResponse.json(
      { error: "Failed to migrate categories" },
      { status: 500 }
    );
  }
}
