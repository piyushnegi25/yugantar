import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Order Success",
  description: "Your order has been placed successfully.",
  path: "/success",
  noIndex: true,
});

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
