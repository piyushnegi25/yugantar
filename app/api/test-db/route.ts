import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdminUser } from "@/lib/security/auth-guards";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminUser(request);
    if (auth.error) {
      return auth.error;
    }

    const connection = await connectDB();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      readyState: connection.connection.readyState,
      host: connection.connection.host,
      name: connection.connection.name,
    });
  } catch (error) {
    console.error("Database connection test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        message: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 }
    );
  }
}
