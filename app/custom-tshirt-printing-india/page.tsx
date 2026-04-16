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
  title: "Custom T-Shirt Printing Online India",
  description:
    "Create and order custom t-shirt prints online in India. Upload your design, personalize your tee, and get premium quality printing with fast delivery.",
  path: "/custom-tshirt-printing-india",
  keywords: [
    "custom t-shirt printing India",
    "personalized t-shirt India",
    "print t-shirts online",
    "design your own t-shirt",
    "custom graphic tee India",
  ],
});

export default function CustomTshirtPrintingIndiaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom T-Shirt Printing India",
    description:
      "Upload artwork and create personalized premium t-shirt prints with fast shipping in India.",
    url: absoluteUrl("/custom-tshirt-printing-india"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        {
          name: "Custom T-Shirt Printing",
          url: "/custom-tshirt-printing-india",
        },
      ]).itemListElement,
    },
    provider: {
      "@type": "Organization",
      name: "Yugantar",
      url: absoluteUrl(),
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader currentPath="/custom-tshirt-printing-india" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Custom T-Shirt Printing Online in India
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600">
            Turn your idea into wearable style. Upload your design, position the
            artwork, and order premium custom printed t-shirts with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/custom">
              <Button>Start Custom Design</Button>
            </Link>
            <Link href="/shipping">
              <Button variant="outline">Shipping Details</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Best For Creators, Teams, and Gifting
        </h2>
        <ul className="mt-4 space-y-3 text-gray-700">
          <li>Personalized t-shirts for birthdays, events, and communities.</li>
          <li>Upload-ready workflow for your own artwork and text.</li>
          <li>Premium base tees for better comfort and print finish.</li>
          <li>India-wide delivery and support from order to dispatch.</li>
        </ul>
      </section>
    </main>
  );
}
