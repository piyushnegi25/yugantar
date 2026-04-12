import type { Metadata } from "next";
import {
  absoluteUrl,
  createCategoryMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createCategoryMetadata({
  categoryName: "Meme",
  description:
    "Buy meme t-shirts online in India. Discover viral internet culture tees, funny graphic designs and premium quality meme apparel.",
  path: "/meme",
  productCount: 25,
});

export default function MemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const memeStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Meme T-Shirts Collection India",
    description:
      "Hilarious meme-inspired t-shirt designs featuring viral internet classics and trending memes. Perfect for expressing your digital culture knowledge.",
    url: absoluteUrl("/meme"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Meme T-Shirts", url: "/meme" },
      ]).itemListElement,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Yugantar",
      url: absoluteUrl(),
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Meme T-Shirts",
      numberOfItems: 25,
      itemListElement: [
        {
          "@type": "Product",
          name: "This is Fine Dog",
          category: "Meme T-Shirts",
        },
        {
          "@type": "Product",
          name: "Drake Pointing Choice",
          category: "Meme T-Shirts",
        },
        {
          "@type": "Product",
          name: "Woman Yelling at Cat",
          category: "Meme T-Shirts",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(memeStructuredData),
        }}
      />
      {children}
    </>
  );
}
