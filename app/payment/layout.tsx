import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Payment",
  description: "Process payment for your order.",
  path: "/payment",
  noIndex: true,
});

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
