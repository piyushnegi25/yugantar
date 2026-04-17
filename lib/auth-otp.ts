import crypto from "crypto";

const OTP_DIGITS = 6;

export function generateNumericOtp(length: number = OTP_DIGITS): string {
  let otp = "";
  for (let i = 0; i < length; i += 1) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
}

export function hashOtp(email: string, otp: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  return crypto
    .createHash("sha256")
    .update(`${normalizedEmail}:${otp}`)
    .digest("hex");
}

export function isValidOtpFormat(value: string): boolean {
  return /^\d{6}$/.test(value);
}
