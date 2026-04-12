import type { Metadata } from "next";
import {
  absoluteUrl,
  createCategoryMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createCategoryMetadata({
  categoryName: "Graphic and Streetwear",
  description:
    "Explore curated premium t-shirt collections in India featuring anime, meme, oversized streetwear and custom designs.",
  path: "/collections",
  productCount: 100,
});

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collectionsStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Premium T-Shirt Collections India",
    description:
      "Curated collections of premium custom t-shirts featuring anime, meme, streetwear and personalized designs.",
    url: absoluteUrl("/collections"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Collections", url: "/collections" },
      ]).itemListElement,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Yugantar",
      url: absoluteUrl(),
    },
    mainEntity: {
      "@type": "ItemList",
      name: "All T-Shirt Collections",
      numberOfItems: 100,
      itemListElement: [
        {
          "@type": "Collection",
          name: "Anime Collection",
          description: "Premium anime-inspired t-shirt designs",
          url: absoluteUrl("/anime"),
        },
        {
          "@type": "Collection",
          name: "Meme Collection",
          description: "Hilarious internet meme t-shirts",
          url: absoluteUrl("/meme"),
        },
        {
          "@type": "Collection",
          name: "Custom Designs",
          description: "Personalized t-shirts with your own designs",
          url: absoluteUrl("/custom"),
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionsStructuredData),
        }}
      />
      {children}
    </>
  );
}
