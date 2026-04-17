import { Metadata } from "next";
import {
  absoluteUrl,
  createMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { ContactPageClient } from "./contact-page-client";

const SUPPORT_EMAIL = "support@yugantar.studio";

export const metadata: Metadata = createMetadata({
  title: "Contact Yugantar - T-Shirt Support India",
  description:
    "Contact Yugantar for order support, shipping help, returns and product inquiries across India.",
  path: "/contact",
  keywords: [
    "contact Yugantar",
    "customer support",
    "t-shirt support India",
    "t-shirt inquiries",
    "Yugantar phone number",
    "Yugantar email",
    "customer service",
  ],
});

export default function ContactPage() {
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Yugantar",
    description:
      "Get in touch with Yugantar for customer support and inquiries about premium t-shirts.",
    url: absoluteUrl("/contact"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
      ]).itemListElement,
    },
    mainEntity: {
      "@type": "Organization",
      name: "Yugantar",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-8810259676",
          contactType: "Customer Service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
          hoursAvailable: "Mo-Su 09:00-21:00",
        },
        {
          "@type": "ContactPoint",
          email: SUPPORT_EMAIL,
          contactType: "Customer Support",
          areaServed: "IN",
        },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "H 34 Sector 12",
        addressLocality: "Noida",
        addressRegion: "Uttar Pradesh",
        postalCode: "201301",
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactStructuredData),
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <SiteHeader currentPath="/contact" />

        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <p className="text-lg text-gray-600">
              We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </div>
        <ContactPageClient supportEmail={SUPPORT_EMAIL} />
      </div>
    </>
  );
}
