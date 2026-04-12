import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  absoluteUrl,
  createMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Oversized T-Shirts Online India - Premium Streetwear Fits",
  description:
    "Shop oversized t-shirts online in India at Yugantar. Discover premium streetwear fits, bold graphics, and comfortable all-day wear.",
  path: "/oversized-tshirts-india",
  keywords: [
    "oversized t-shirts India",
    "buy oversized tees online",
    "streetwear t-shirts India",
    "baggy fit t-shirt India",
    "premium oversized tshirt",
  ],
});

export default function OversizedTshirtsIndiaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Oversized T-Shirts Online India",
    description:
      "Premium oversized t-shirts and streetwear-inspired fits for shoppers across India.",
    url: absoluteUrl("/oversized-tshirts-india"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Oversized T-Shirts", url: "/oversized-tshirts-india" },
      ]).itemListElement,
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Oversized T-Shirts Online in India
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600">
            Elevate everyday style with premium oversized t-shirts designed for
            comfort, movement and standout streetwear aesthetics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/collections">
              <Button>Shop Oversized Collection</Button>
            </Link>
            <Link href="/anime">
              <Button variant="outline">Explore Anime Tees</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Why Oversized Fits Are Popular
        </h2>
        <ul className="mt-4 space-y-3 text-gray-700">
          <li>Relaxed silhouette for modern streetwear styling.</li>
          <li>Breathable, premium fabric suited for all-day comfort.</li>
          <li>Pairs easily with cargos, denims, joggers, and layered looks.</li>
          <li>Graphic-heavy styles for anime, meme and culture-inspired fashion.</li>
        </ul>
      </section>
    </main>
  );
}
