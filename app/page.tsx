import type { Metadata } from "next";
import { DynamicFeaturedProducts } from "@/components/dynamic-featured-products";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { HomeFeatureBanner } from "@/components/home-feature-banner";
import { SiteHeader } from "@/components/site-header";
import {
  absoluteUrl,
  createMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Buy Premium T-Shirts Online - Anime, Meme, Custom",
  description:
    "Shop premium t-shirts online in India at Yugantar. Explore anime t-shirts, meme t-shirts, oversized streetwear, and custom printed tees with fast shipping.",
  path: "/",
  keywords: [
    "buy t-shirts online India",
    "anime t-shirts online",
    "meme t-shirts India",
    "custom t-shirt printing India",
    "oversized t-shirts",
    "streetwear India",
    "t-shirt alternatives to myntra ajio snitch bewakoof wrogn",
  ],
});

export default function Home() {
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Buy Premium T-Shirts Online in India",
    description:
      "Shop premium anime, meme, oversized and custom t-shirts with fast shipping across India.",
    url: absoluteUrl("/"),
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "Yugantar",
      url: absoluteUrl(),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
      ]).itemListElement,
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homePageStructuredData),
        }}
      />
      <SiteHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <HomeHeroCarousel />

        {/* BESTSELLERS */}
        <section className="container py-14 sm:py-18 md:py-24 max-w-screen-2xl mx-auto">
          <div className="flex flex-col items-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-[clamp(1.5rem,6vw,2.25rem)] font-bold uppercase tracking-tight text-foreground">Our Bestsellers</h2>
            <div className="w-14 sm:w-16 h-1 bg-primary mt-4 sm:mt-6"></div>
          </div>
          <DynamicFeaturedProducts />
        </section>

        {/* FEATURE BANNER */}
        <HomeFeatureBanner />
      </main>

    </div>
  );
}
