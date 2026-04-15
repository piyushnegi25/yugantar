import { type NextRequest, NextResponse } from "next/server"
import { getExpiredAuthCookieOptions } from "@/lib/security/cookies";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })

  // Clear the auth cookie
  response.cookies.set("auth_token", "", getExpiredAuthCookieOptions())

  return response
}
