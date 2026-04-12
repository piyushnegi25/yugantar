import type { Metadata } from "next";
import {
  absoluteUrl,
  createMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Custom T-Shirt Printing Online India",
  description:
    "Design your own custom t-shirt online in India. Upload artwork, add text, and create personalized premium printed tees with fast delivery.",
  path: "/custom",
  keywords: [
    "custom t-shirt design",
    "personalized t-shirts",
    "design your own t-shirt",
    "custom printing",
    "upload design t-shirt",
    "personalized clothing India",
    "custom apparel",
    "DIY t-shirt design",
  ],
});

export default function CustomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom T-Shirt Design Service",
    description:
      "Create your own custom t-shirt with personalized designs, text, and artwork on premium organic cotton.",
    url: absoluteUrl("/custom"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Custom T-Shirts", url: "/custom" },
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
    offers: {
      "@type": "Offer",
      name: "Custom T-Shirt Design",
      description:
        "Professional custom t-shirt printing service with high-quality materials",
      priceCurrency: "INR",
      price: "499",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "499",
        priceCurrency: "INR",
        minPrice: "499",
        maxPrice: "999",
      },
    },
    serviceType: "Custom Apparel Design",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(customStructuredData),
        }}
      />
      {children}
    </>
  );
}
