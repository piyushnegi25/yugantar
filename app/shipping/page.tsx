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
  title: "Shipping Information - T-Shirt Delivery India",
  description:
    "Learn about shipping timelines, delivery coverage, and order dispatch for Yugantar t-shirts across India.",
  path: "/shipping",
  keywords: [
    "t-shirt shipping India",
    "delivery time t-shirts",
    "yugantar shipping policy",
    "anime t-shirt delivery",
    "custom t-shirt shipping",
  ],
});

export default function ShippingPage() {
  const shippingStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shipping Information",
    description:
      "Shipping and delivery information for Yugantar t-shirt orders in India.",
    url: absoluteUrl("/shipping"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Shipping", url: "/shipping" },
      ]).itemListElement,
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader currentPath="/shipping" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(shippingStructuredData),
        }}
      />

      <section className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Shipping Information
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600">
            We ship Yugantar t-shirts across India with reliable courier partners.
            Timelines vary by city tier and product type.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold text-gray-900">Dispatch Time</h2>
            <p className="mt-2 text-gray-700">
              Most ready designs are dispatched within 24-48 hours. Custom
              printed t-shirts may require extra production time.
            </p>
          </article>

          <article className="rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold text-gray-900">Delivery ETA</h2>
            <p className="mt-2 text-gray-700">
              Metro cities: 3-7 business days. Non-metro regions: 5-10 business
              days after dispatch.
            </p>
          </article>

          <article className="rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold text-gray-900">Tracking</h2>
            <p className="mt-2 text-gray-700">
              Tracking details are shared after shipment pickup. You can use the
              tracking link from your order communication.
            </p>
          </article>

          <article className="rounded-lg border border-gray-200 p-5">
            <h2 className="text-xl font-semibold text-gray-900">Support</h2>
            <p className="mt-2 text-gray-700">
              If your parcel is delayed, contact support@yugantar.studio with your
              order details for quick help.
            </p>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/collections">
            <Button>Continue Shopping</Button>
          </Link>
          <Link href="/faq">
            <Button variant="outline">Read FAQs</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
