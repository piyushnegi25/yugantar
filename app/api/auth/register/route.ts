import { type NextRequest, NextResponse } from "next/server";
import {
  createUser,
  getUserByEmail,
  hashPassword,
  createJWT,
} from "@/lib/auth";
import { getAuthCookieOptions } from "@/lib/security/cookies";
import {
  isValidEmail,
  sanitizeEmail,
  sanitizeName,
} from "@/lib/security/validation";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    const normalizedEmail = sanitizeEmail(email);
    const normalizedName = sanitizeName(name);

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const rateLimit = checkRateLimit(`auth:register:${clientIp}`, {
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": `${Math.ceil((rateLimit.resetAt - Date.now()) / 1000)}`,
          },
        }
      );
    }

    if (!normalizedEmail || !password || !normalizedName) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await createUser({
      email: normalizedEmail,
      name: normalizedName,
      password: hashedPassword,
      provider: "email",
      role: "user",
    });

    const token = await createJWT(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("auth_token", token, getAuthCookieOptions());

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
