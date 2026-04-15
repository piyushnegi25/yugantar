import { type NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { getExpiredAuthCookieOptions } from "@/lib/security/cookies";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      // Clear invalid cookie
      const response = NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
      response.cookies.set("auth_token", "", getExpiredAuthCookieOptions());
      return response;
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);

    // Clear invalid cookie on error
    const response = NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
    response.cookies.set("auth_token", "", getExpiredAuthCookieOptions());
    return response;
  }
}
