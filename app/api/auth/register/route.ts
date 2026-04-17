import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error:
        "Direct registration is disabled. Use /api/auth/register/start and verify OTP to complete signup.",
    },
    { status: 410 }
  );
}
