"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Grid,
  List,
  ShoppingCart,
  Heart,
  Loader2,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CartBadge } from "@/components/cart-badge";
import { CategoryFilterChips } from "@/components/category-filter-chips";
import { normalizeStock, getTotalStock } from "@/lib/stock-normalization";
import { CategoryHeroBanner } from "@/components/category-hero-banner";
import { DynamicNavbar } from "@/components/dynamic-navbar";
import { UserMenu } from "@/components/auth/user-menu";
import { ProductCardActions } from "@/components/product-card-actions";

interface Product {
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

const COLLECTIONS_HERO_FALLBACK = {
  src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
  alt: "Collections hero banner",
  title: "Curated Collections",
  subtitle:
    "Explore our exclusive collections of t-shirts, hand-picked for every style and occasion.",
  ctaText: "Explore Collection",
  linkUrl: "/collections",
};

export default function CollectionsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [collectionsProducts, setCollectionsProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCollectionsProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const fetchCollectionsProducts = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const response = await fetch("/api/products?category=collections", {
        signal,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      const products: Product[] = Array.isArray(data.products)
        ? data.products
        : [];

      setCollectionsProducts(products);
      // Initialize default sizes - select first available size
      const defaultSizes: Record<string, string> = {};
      products.forEach((product: Product) => {
        const normalizedStock = normalizeStock(product.stock, product.sizes);
        // Find first size that's in stock
        const availableSize = product.sizes.find(
          (size) => (normalizedStock[size] || 0) > 0
        );
        defaultSizes[product._id] = availableSize || product.sizes[0] || "M";
      });
      setSelectedSizes(defaultSizes);
      setError(null);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") {
        return;
      }

      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const filteredProducts = collectionsProducts.filter((product) => {
    if (selectedCategory === "all") return true;
    return product.tags.some((tag) =>
      tag.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  });

  // Get unique categories from product tags for filtering
  const categories = [
    { id: "all", name: "All", count: collectionsProducts.length },
    ...Array.from(
      new Set(
        collectionsProducts.flatMap((product) =>
          product.tags.map((tag) => tag.toLowerCase())
        )
      )
    ).map((tag) => ({
      id: tag,
      name: tag.charAt(0).toUpperCase() + tag.slice(1),
      count: collectionsProducts.filter((p) =>
        p.tags.map((t) => t.toLowerCase()).includes(tag)
      ).length,
    })),
  ];

  const getProductBadge = (product: Product) => {
    if (product.isFeatured) return "Featured";
    if (product.tags.includes("bestseller")) return "Bestseller";
    if (product.tags.includes("new")) return "New";
    if (product.tags.includes("viral")) return "Viral";
    if (product.tags.includes("trending")) return "Trending";
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 ">
            Loading collections...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50  flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => fetchCollectionsProducts()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white  border-b border-gray-200  shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 "
            >
              Yugantar
            </Link>
            <DynamicNavbar currentPath="/collections" />
          </div>
          <div className="flex items-center space-x-4">
            <UserMenu />
            <CartBadge />
          </div>
        </div>
      </header>

      <CategoryHeroBanner
        position="collections_hero"
        fallback={COLLECTIONS_HERO_FALLBACK}
        priority
      />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Filters */}
        <div className="bg-white  rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <CategoryFilterChips
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10 p-0"
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10 p-0"
                  aria-label="List view"
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </Button>
                </div>
                <p className="text-sm text-gray-600">{filteredProducts.length} products</p>
              </div>
            </div>
          </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 ">
              No products found for the selected category.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "flex flex-col gap-3 sm:gap-4"
            }
          >
            {filteredProducts.map((product) => {
              const badge = getProductBadge(product);
              return (
                <Card
                  key={product._id}
                  className={`group hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:scale-105 ${
                    viewMode === "list" ? "flex-row min-h-48" : "min-h-96"
                  }`}
                >
                  <CardContent
                    className={`p-0 h-full ${
                      viewMode === "list" ? "flex" : "flex flex-col"
                    }`}
                  >
                    <div
                      className={`relative ${
                        viewMode === "list"
                          ? "w-48 flex-shrink-0"
                          : "aspect-square w-full"
                      }`}
                    >
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-300 ${
                          viewMode === "list" ? "rounded-l-lg" : "rounded-t-lg"
                        }`}
                      />
                      {badge && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                          {badge}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      {product.originalPrice && (
                        <Badge className="absolute bottom-2 left-2 bg-green-500">
                          Save ₹
                          {(product.originalPrice - product.price).toFixed(2)}
                        </Badge>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600  text-sm mb-3 line-clamp-2 flex-grow">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium ml-1">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600 ">
                          {product.reviews} reviews
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900 ">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Size Options */}
                      <div className="mb-3">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700  flex-shrink-0">
                            Size:
                          </span>
                          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                            {product.sizes.map((size) => {
                              const normalizedStock = normalizeStock(
                                product.stock,
                                product.sizes
                              );
                              const isOutOfStock =
                                (normalizedStock[size] || 0) === 0;
                              return (
                                <button
                                  key={size}
                                  onClick={() => {
                                    if (!isOutOfStock) {
                                      handleSizeChange(product._id, size);
                                    }
                                  }}
                                  disabled={isOutOfStock}
                                  className={`px-3 py-2 text-sm rounded-md border flex-shrink-0 transition-colors ${
                                    isOutOfStock
                                      ? "bg-gray-300  text-gray-500  border-gray-300  cursor-not-allowed opacity-60"
                                      : selectedSizes[product._id] === size
                                      ? "bg-gray-900 text-white border-transparent"
                                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                                  }`}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Add to Cart Section */}
                      <div className="mt-auto">
                        <ProductCardActions
                          product={product}
                          selectedSize={selectedSizes[product._id]}
                          normalizedStock={normalizeStock(product.stock, product.sizes)}
                        />

                        {/* Stock Information */}
                        {(() => {
                          const totalStock = getTotalStock(
                            product.stock,
                            product.sizes
                          );
                          return (
                            <>
                              {totalStock <= 5 && totalStock > 0 && (
                                <p className="text-orange-600 text-xs mt-1 text-center">
                                  Only {totalStock} left in stock!
                                </p>
                              )}
                              {totalStock === 0 && (
                                <p className="text-red-600 text-xs mt-1 text-center">
                                  Out of stock
                                </p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
