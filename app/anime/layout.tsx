import type { Metadata } from "next";
import {
  absoluteUrl,
  createCategoryMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createCategoryMetadata({
  categoryName: "Anime",
  description:
    "Buy anime t-shirts online in India. Shop Naruto, Dragon Ball Z, Attack on Titan, Demon Slayer and more premium anime-inspired graphic tees.",
  path: "/anime",
  productCount: 30,
});

export default function AnimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const animeStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Anime T-Shirts Collection India",
    description:
      "Premium anime-inspired t-shirt designs featuring popular series like Naruto, Dragon Ball Z, Attack on Titan, and more.",
    url: absoluteUrl("/anime"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Anime T-Shirts", url: "/anime" },
      ]).itemListElement,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Yugantar",
      url: absoluteUrl(),
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Anime T-Shirts",
      numberOfItems: 30,
      itemListElement: [
        {
          "@type": "Product",
          name: "Naruto Hokage Legacy",
          category: "Anime T-Shirts",
        },
        {
          "@type": "Product",
          name: "Dragon Ball Z Power",
          category: "Anime T-Shirts",
        },
        {
          "@type": "Product",
          name: "Attack on Titan Wings",
          category: "Anime T-Shirts",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(animeStructuredData),
        }}
      />
      {children}
    </>
  );
}
