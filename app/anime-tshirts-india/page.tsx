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
  title: "Anime T-Shirts Online India - Premium Otaku Streetwear",
  description:
    "Buy anime t-shirts online in India. Shop premium graphic tees inspired by popular anime culture with comfortable fits and sharp prints.",
  path: "/anime-tshirts-india",
  keywords: [
    "anime t-shirts India",
    "buy anime tees online",
    "otaku clothing India",
    "anime graphic tees",
    "naruto dragon ball t-shirts",
  ],
});

export default function AnimeTshirtsIndiaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Anime T-Shirts Online India",
    description:
      "Premium anime-inspired t-shirts for otaku and streetwear shoppers in India.",
    url: absoluteUrl("/anime-tshirts-india"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Anime T-Shirts", url: "/anime-tshirts-india" },
      ]).itemListElement,
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader currentPath="/anime-tshirts-india" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Anime T-Shirts Online in India
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600">
            From iconic characters to minimalist anime motifs, explore premium
            anime-inspired t-shirts built for daily wear and fandom expression.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/anime">
              <Button>Shop Anime Collection</Button>
            </Link>
            <Link href="/collections">
              <Button variant="outline">Browse All Tees</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">What You Get</h2>
        <ul className="mt-4 space-y-3 text-gray-700">
          <li>Anime-inspired artwork with premium print clarity.</li>
          <li>Comfort-first fabric suitable for daily styling.</li>
          <li>Streetwear-ready fits including relaxed and oversized options.</li>
          <li>Fast delivery across India with responsive support.</li>
        </ul>
      </section>
    </main>
  );
}
