"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  ctaText: string;
  linkUrl: string;
}

interface ApiBanner {
  _id?: string;
  image?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  linkUrl?: string;
  order?: number;
}

const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    id: "fallback-1",
    src: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2070&auto=format&fit=crop",
    alt: "Streetwear hero model",
    title: "Till End of the Era",
    subtitle: "Premium oversized streetwear and graphic tees",
    ctaText: "Shop Collection",
    linkUrl: "/collections",
  },
  {
    id: "fallback-2",
    src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop",
    alt: "Urban fashion collection",
    title: "Wear Your Story",
    subtitle: "Statement pieces for everyday style",
    ctaText: "Explore Drops",
    linkUrl: "/collections",
  },
  {
    id: "fallback-3",
    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2070&auto=format&fit=crop",
    alt: "Premium oversized tee",
    title: "Built For Expression",
    subtitle: "Designs that stand out from the crowd",
    ctaText: "View Products",
    linkUrl: "/collections",
  },
];

export function HomeHeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(FALLBACK_HERO_SLIDES);

  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadHeroBanners = async () => {
      try {
        const response = await fetch("/api/banners?position=home_hero", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const banners: ApiBanner[] = Array.isArray(data.banners)
          ? data.banners
          : [];

        const remoteSlides = banners
          .filter(
            (banner): banner is ApiBanner & { image: string } =>
              typeof banner?.image === "string" && banner.image.length > 0
          )
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((banner, index) => ({
            id: banner._id || `remote-${index}`,
            src: banner.image,
            alt: banner.alt || "Homepage banner",
            title: banner.title || "Till End of the Era",
            subtitle: banner.subtitle || "Premium oversized streetwear and graphic tees",
            ctaText: banner.ctaText || "Shop Collection",
            linkUrl: banner.linkUrl || "/collections",
          }));

        if (isMounted && remoteSlides.length > 0) {
          setHeroSlides(remoteSlides);
          setCurrentSlide(0);
        }
      } catch (error) {
        if ((error as Error)?.name === "AbortError") {
          return;
        }

        console.error("Failed to load hero banners:", error);
      }
    };

    loadHeroBanners();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, heroSlides.length]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCurrentSlide = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    updateCurrentSlide();
    api.on("select", updateCurrentSlide);
    api.on("reInit", updateCurrentSlide);

    return () => {
      api.off("select", updateCurrentSlide);
      api.off("reInit", updateCurrentSlide);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isInteracting) {
      return;
    }

    const autoPlay = setInterval(() => {
      if (document.visibilityState === "visible") {
        api.scrollNext();
      }
    }, 5000);

    return () => clearInterval(autoPlay);
  }, [api, isInteracting]);

  const pauseAutoPlay = () => setIsInteracting(true);
  const resumeAutoPlay = () => setIsInteracting(false);

  return (
    <section
      className="relative h-[74vh] min-h-[420px] w-full overflow-hidden bg-muted sm:h-[80vh] md:h-[85vh]"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
      onTouchStart={pauseAutoPlay}
      onTouchEnd={resumeAutoPlay}
      onTouchCancel={resumeAutoPlay}
      onFocusCapture={pauseAutoPlay}
      onBlurCapture={resumeAutoPlay}
    >
      <Carousel
        key={heroSlides.length}
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          containScroll: "trimSnaps",
        }}
        className="h-full w-full"
      >
        <CarouselContent className="-ml-0 h-full">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative h-[74vh] min-h-[420px] w-full sm:h-[80vh] md:h-[85vh]">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center sm:px-6">
          <h1 className="mb-4 text-[clamp(2rem,9vw,6rem)] font-black uppercase tracking-[0.08em] text-white drop-shadow-lg sm:mb-6">
            {activeSlide?.title || "Till End of the Era"}
          </h1>
          {activeSlide?.subtitle ? (
            <p className="mb-6 max-w-2xl text-[clamp(0.95rem,3.2vw,1.25rem)] leading-relaxed text-white/90">
              {activeSlide.subtitle}
            </p>
          ) : null}
          <Link href={activeSlide?.linkUrl || "/collections"}>
            <Button
              size="lg"
              className="h-11 rounded-none bg-primary px-6 text-sm font-bold uppercase tracking-[0.08em] text-white hover:bg-primary/90 sm:h-12 sm:px-8 sm:text-base md:px-10 md:text-lg"
            >
              {activeSlide?.ctaText || "Shop Collection"}
            </Button>
          </Link>
        </div>

        <CarouselPrevious className="left-3 top-1/2 z-20 h-12 w-12 -translate-y-1/2 border-white/70 bg-black/45 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white md:h-11 md:w-11" />
        <CarouselNext className="right-3 top-1/2 z-20 h-12 w-12 -translate-y-1/2 border-white/70 bg-black/45 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white md:h-11 md:w-11" />
      </Carousel>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              currentSlide === index
                ? "w-6 bg-white"
                : "w-2.5 bg-white/60 hover:bg-white"
            )}
          />
        ))}
      </div>
    </section>
  );
}
