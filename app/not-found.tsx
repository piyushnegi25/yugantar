import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Page Not Found",
  description: "The page you requested could not be found.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-4 text-gray-600">
          Sorry, we could not find this page. Explore our latest t-shirt
          collections instead.
        </p>
        <Link
          href="/collections"
          className="mt-8 inline-flex rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Browse Collections
        </Link>
      </div>
    </main>
  );
}
