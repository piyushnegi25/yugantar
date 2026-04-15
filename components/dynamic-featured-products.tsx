"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getTotalStock, normalizeStock } from "@/lib/stock-normalization";
import { ProductCardActions } from "@/components/product-card-actions";

interface ApiProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  stock: number | { [size: string]: number };
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
}

export function DynamicFeaturedProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {}
  );

  const loadProducts = async (signal?: AbortSignal) => {
    try {
      const response = await fetch(`/api/products?isFeatured=true&_t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
        signal,
      });

      if (!response.ok) {
        console.error("Failed to fetch featured products");
        return;
      }

      const data = await response.json();
      const fetchedProducts: ApiProduct[] = Array.isArray(data.products)
        ? data.products
        : [];

      setProducts(fetchedProducts);

      const defaultSizes: Record<string, string> = {};
      fetchedProducts.forEach((product) => {
        const normalizedStock = normalizeStock(product.stock, product.sizes);
        const availableSize = product.sizes.find(
          (size) => (normalizedStock[size] || 0) > 0
        );

        defaultSizes[product._id] = availableSize || product.sizes[0] || "M";
      });

      setSelectedSizes(defaultSizes);
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        return;
      }

      console.error("Failed to load products:", error);
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProducts(controller.signal);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      controller.abort();
    };
  }, []);

  const getProductBadge = (product: ApiProduct) => {
    if (product.isFeatured) return "Featured";
    if (product.tags?.includes("bestseller")) return "Bestseller";
    if (product.tags?.includes("new")) return "New";
    if (product.tags?.includes("viral")) return "Viral";
    if (product.tags?.includes("trending")) return "Trending";
    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-72 animate-pulse">
            <div className="flex h-full flex-col p-0">
              <div className="mb-2 aspect-square flex-shrink-0 rounded-t-lg bg-gray-200" />
              <div className="flex-1 space-y-1 p-2">
                <div className="h-3 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
                <div className="mt-auto h-6 w-full rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-xs text-muted-foreground">
          No featured products available
        </p>
        <Link href="/admin/catalog">
          <Button variant="outline">Add Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: products.length > 4,
        containScroll: "trimSnaps",
      }}
      className="w-full overflow-hidden"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product) => {
          const badge = getProductBadge(product);
          const normalizedStock = normalizeStock(product.stock, product.sizes);
          const totalStock = getTotalStock(product.stock, product.sizes);

          return (
            <CarouselItem
              key={product._id}
              className="basis-[85%] pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="h-full">
                <Card className="group flex h-full min-h-96 flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="flex h-full flex-col p-0">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={
                          product.images[0] ||
                          "/placeholder.svg?height=400&width=400"
                        }
                        alt={product.name}
                        fill
                        className="rounded-t-lg object-cover transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />
                      {badge && (
                        <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
                          {badge}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      {product.originalPrice && (
                        <Badge className="absolute bottom-2 left-2 bg-green-500">
                          Save ₹
                          {(product.originalPrice - product.price).toFixed(2)}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="mb-2 line-clamp-1 text-lg font-semibold transition-colors group-hover:text-blue-600">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mb-3 flex-grow text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>

                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-muted-foreground">
                          {product.reviews} reviews
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="mb-2 flex items-start gap-2">
                          <span className="flex-shrink-0 text-sm font-medium text-gray-700">
                            Size:
                          </span>
                          <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                            {product.sizes.map((size) => {
                              const isOutOfStock =
                                (normalizedStock[size] || 0) === 0;

                              return (
                                <button
                                  key={size}
                                  onClick={() => {
                                    if (!isOutOfStock) {
                                      setSelectedSizes((prev) => ({
                                        ...prev,
                                        [product._id]: size,
                                      }));
                                    }
                                  }}
                                  disabled={isOutOfStock}
                                  className={`flex-shrink-0 rounded-md border px-3 py-2 text-sm transition-colors ${
                                    isOutOfStock
                                      ? "cursor-not-allowed border-gray-300 bg-gray-300 text-gray-500 opacity-60"
                                      : selectedSizes[product._id] === size
                                        ? "border-transparent bg-gray-900 text-white"
                                        : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <ProductCardActions
                          product={product}
                          selectedSize={selectedSizes[product._id]}
                          normalizedStock={normalizedStock}
                        />

                        {totalStock <= 5 && totalStock > 0 && (
                          <p className="mt-1 text-center text-xs text-orange-600">
                            Only {totalStock} left in stock!
                          </p>
                        )}
                        {totalStock === 0 && (
                          <p className="mt-1 text-center text-xs text-red-600">
                            Out of stock
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-2 top-1/2 z-10 hidden -translate-y-1/2 border-border bg-background/95 hover:bg-background md:flex" />
      <CarouselNext className="right-2 top-1/2 z-10 hidden -translate-y-1/2 border-border bg-background/95 hover:bg-background md:flex" />
    </Carousel>
  );
}
