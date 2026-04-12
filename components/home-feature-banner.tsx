"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FeatureBanner {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  ctaText: string;
  linkUrl: string;
}

interface ApiFeatureBanner {
  _id?: string;
  image?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  linkUrl?: string;
}

const FALLBACK_BANNER: FeatureBanner = {
  id: "fallback-feature",
  src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop",
  alt: "Centre Stage Collection",
  title: "Centre Stage Collection",
  subtitle: "Curated drops built for bold fits and everyday wear.",
  ctaText: "Explore Now",
  linkUrl: "/collections/centre-stage",
};

export function HomeFeatureBanner() {
  const [banner, setBanner] = useState<FeatureBanner>(FALLBACK_BANNER);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadFeatureBanner = async () => {
      try {
        const response = await fetch("/api/banners?position=home_feature&limit=1", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const banners: ApiFeatureBanner[] = Array.isArray(data.banners)
          ? data.banners
          : [];
        const remoteBanner = banners.find(
          (entry): entry is ApiFeatureBanner & { image: string } =>
            typeof entry?.image === "string" && entry.image.length > 0
        );

        if (!isMounted || !remoteBanner) {
          return;
        }

        setBanner({
          id: remoteBanner._id || "remote-feature",
          src: remoteBanner.image,
          alt: remoteBanner.alt || "Feature banner",
          title: remoteBanner.title || "Centre Stage Collection",
          subtitle:
            remoteBanner.subtitle ||
            "Curated drops built for bold fits and everyday wear.",
          ctaText: remoteBanner.ctaText || "Explore Now",
          linkUrl: remoteBanner.linkUrl || "/collections",
        });
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          return;
        }

        console.error("Failed to load feature banner:", error);
      }
    };

    loadFeatureBanner();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <section className="relative mt-10 h-[60vh] min-h-[360px] w-full overflow-hidden bg-muted sm:h-[66vh] md:h-[70vh]">
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        className="object-cover object-top"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-end p-4 pb-12 text-center sm:pb-16 md:pb-20">
        <h2 className="mb-3 text-[clamp(1.8rem,8vw,3.75rem)] font-bold uppercase tracking-[0.08em] text-white md:mb-4">
          {banner.title}
        </h2>
        {banner.subtitle ? (
          <p className="mb-6 max-w-2xl text-[clamp(0.9rem,3vw,1.125rem)] leading-relaxed text-white/90 md:mb-8">
            {banner.subtitle}
          </p>
        ) : null}
        <Link href={banner.linkUrl}>
          <Button
            variant="outline"
            size="lg"
            className="h-11 rounded-none border-none bg-white px-6 text-sm font-bold uppercase tracking-[0.08em] text-black hover:bg-gray-100 hover:text-black sm:h-12 sm:px-8 sm:text-base md:px-10 md:text-lg"
          >
            {banner.ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
