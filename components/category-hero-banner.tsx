"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CategoryHeroPosition = "collections_hero" | "anime_hero" | "meme_hero";

interface CategoryHeroBannerProps {
  position: CategoryHeroPosition;
  fallback: {
    src: string;
    alt: string;
    title: string;
    subtitle: string;
    ctaText?: string;
    linkUrl?: string;
  };
  className?: string;
  priority?: boolean;
}

interface BannerResponseItem {
  _id?: string;
  image?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  linkUrl?: string;
}

interface LoadedHeroBanner {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  ctaText: string;
  linkUrl: string;
}

export function CategoryHeroBanner({
  position,
  fallback,
  className,
  priority = false,
}: CategoryHeroBannerProps) {
  const [banner, setBanner] = useState<LoadedHeroBanner>({
    src: fallback.src,
    alt: fallback.alt,
    title: fallback.title,
    subtitle: fallback.subtitle,
    ctaText: fallback.ctaText || "Explore Now",
    linkUrl: fallback.linkUrl || "/collections",
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadBanner = async () => {
      try {
        const response = await fetch(`/api/banners?position=${position}&limit=1`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const items: BannerResponseItem[] = Array.isArray(data.banners)
          ? data.banners
          : [];

        const firstBanner = items.find(
          (entry): entry is BannerResponseItem & { image: string } =>
            typeof entry?.image === "string" && entry.image.length > 0
        );

        if (!isMounted || !firstBanner) {
          return;
        }

        setBanner({
          src: firstBanner.image,
          alt: firstBanner.alt || fallback.alt,
          title: firstBanner.title || fallback.title,
          subtitle: firstBanner.subtitle || fallback.subtitle,
          ctaText: firstBanner.ctaText || fallback.ctaText || "Explore Now",
          linkUrl: firstBanner.linkUrl || fallback.linkUrl || "/collections",
        });
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          return;
        }

        console.error(`Failed to load ${position} banner:`, error);
      }
    };

    loadBanner();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [position, fallback]);

  return (
    <section
      className={cn(
        "relative min-h-[320px] w-full overflow-hidden py-14 text-white sm:py-16 md:min-h-[420px] md:py-20",
        className
      )}
    >
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority={priority}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 container mx-auto px-4 text-center sm:px-6">
        <h1 className="text-[clamp(2rem,7vw,4rem)] font-bold leading-tight">
          {banner.title}
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-[clamp(0.95rem,3vw,1.5rem)] leading-relaxed text-white/90">
          {banner.subtitle}
        </p>
        <Link href={banner.linkUrl}>
          <Button className="mt-6 h-11 px-6 text-sm bg-white text-black hover:bg-white/90 sm:mt-8 sm:h-12 sm:px-8 sm:text-base">
            {banner.ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
