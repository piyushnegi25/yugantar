import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

export function getAuthCookieOptions(
  maxAge: number = SEVEN_DAYS_IN_SECONDS
): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export function getExpiredAuthCookieOptions(): Partial<ResponseCookie> {
  return getAuthCookieOptions(0);
}
