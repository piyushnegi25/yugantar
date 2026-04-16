import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import {
  absoluteUrl,
  createMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Best T-Shirt Brands in India - Yugantar Alternative",
  description:
    "Looking for alternatives to popular t-shirt brands in India? Compare styles and shop premium anime, meme, streetwear and custom t-shirts at Yugantar.",
  path: "/tshirt-brands-india",
  keywords: [
    "best t-shirt brands in India",
    "myntra alternative t-shirts",
    "ajio alternative t-shirts",
    "snitch alternative t-shirts",
    "bewakoof alternative",
    "wrogn alternative",
    "bearhouse alternative",
    "soulstore alternative",
    "premium t-shirt brand India",
  ],
});

const brandNames = [
  "Myntra",
  "AJIO",
  "Snitch",
  "Bewakoof",
  "Verado",
  "Wrogn",
  "Bear House",
  "Soulstore",
];

export default function TshirtBrandsIndiaPage() {
  const comparisonStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Best T-Shirt Brands in India",
    description:
      "Discover premium t-shirt options in India and compare style focus, quality, and personalization capabilities.",
    url: absoluteUrl("/tshirt-brands-india"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Best T-Shirt Brands in India", url: "/tshirt-brands-india" },
      ]).itemListElement,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Popular T-Shirt Shopping Destinations in India",
      itemListElement: brandNames.map((brand, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: brand,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader currentPath="/tshirt-brands-india" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(comparisonStructuredData),
        }}
      />

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Best T-Shirt Brands in India: Find the Right Fit for Your Style
          </h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600 sm:text-lg">
            If you are exploring options beyond large marketplaces and mainstream
            labels, Yugantar is built for shoppers who want premium quality,
            expressive designs, and niche categories like anime, meme and custom
            print t-shirts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/collections">
              <Button>Shop Collections</Button>
            </Link>
            <Link href="/custom">
              <Button variant="outline">Design Custom Tee</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Popular Names People Compare
        </h2>
        <p className="mt-3 text-gray-600">
          Shoppers often compare platforms and brands such as Myntra, AJIO,
          Snitch, Bewakoof, Verado, Wrogn, Bear House and Soulstore when looking
          for t-shirts online in India.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brandNames.map((brand) => (
            <div
              key={brand}
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          What to Look for Before You Buy
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900">Fabric Quality</h3>
            <p className="mt-2 text-sm text-gray-700">
              Prioritize breathable cotton blends, soft hand-feel, and durable
              stitching for long-term comfort.
            </p>
          </article>
          <article className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900">Print Durability</h3>
            <p className="mt-2 text-sm text-gray-700">
              Check if prints are wash-safe and colorfast so graphics stay sharp
              after repeated use.
            </p>
          </article>
          <article className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900">Fit and Size Range</h3>
            <p className="mt-2 text-sm text-gray-700">
              Ensure clear size guidance and broad fit options for better
              conversion and fewer returns.
            </p>
          </article>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Why Choose Yugantar
        </h2>
        <ul className="mt-4 space-y-3 text-gray-700">
          <li>Premium t-shirt quality with comfort-focused fits and durable prints.</li>
          <li>Specialized anime and meme collections for expressive streetwear style.</li>
          <li>Custom t-shirt creation for personalized gifting and unique fashion.</li>
          <li>India-focused shipping and support for smooth order experience.</li>
        </ul>

        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm text-gray-700">
            Brand names listed above are referenced only to help shoppers discover
            alternatives. Yugantar is an independent brand and is not affiliated
            with those companies.
          </p>
        </div>
      </section>
    </main>
  );
}
