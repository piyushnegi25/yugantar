import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import type { IUser } from "@/lib/models/User";

type AuthGuardResult =
  | {
      user: IUser;
      error: null;
    }
  | {
      user: null;
      error: NextResponse;
    };

export async function requireAuthenticatedUser(
  request: NextRequest
): Promise<AuthGuardResult> {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: "Invalid authentication" },
        { status: 401 }
      ),
    };
  }

  return { user, error: null };
}

export async function requireAdminUser(
  request: NextRequest
): Promise<AuthGuardResult> {
  const auth = await requireAuthenticatedUser(request);
  if (auth.error) {
    return auth;
  }

  if (auth.user.role !== "admin") {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return auth;
}
