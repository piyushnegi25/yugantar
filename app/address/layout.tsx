import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Address",
  description: "Manage your shipping address for orders.",
  path: "/address",
  noIndex: true,
});

export default function AddressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
