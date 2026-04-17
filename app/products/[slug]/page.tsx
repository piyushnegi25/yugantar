import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCart } from "@/components/add-to-cart";
import { findProductBySlug } from "@/lib/data/products";
import { normalizeStock } from "@/lib/stock-normalization";
import { createMetadata } from "@/lib/seo";
import { ProductImageGallery } from "@/components/product-image-gallery";
import { SiteHeader } from "@/components/site-header";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await findProductBySlug(slug);

  if (!product || !product.isActive) {
    return createMetadata({
      title: "Product Not Found",
      description: "Requested product is not available.",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: `${product.name} - Buy Online`,
    description: product.description,
    path: `/products/${slug}`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await findProductBySlug(slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const stock = normalizeStock(product.stock, product.sizes || []);
  const defaultSize =
    (product.sizes || []).find((size: string) => (stock[size] || 0) > 0) ||
    product.sizes?.[0] ||
    "M";

  return (
    <main className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8 sm:py-10">
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/collections" className="hover:text-gray-900">
            Collections
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <Card>
              <CardContent className="p-3 sm:p-4">
                <ProductImageGallery images={images} alt={product.name} />
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardContent className="space-y-5 p-4 sm:p-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {product.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.originalPrice ? (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(product.category || []).map((cat: string) => (
                    <Badge key={cat} variant="outline" className="capitalize">
                      {cat}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                    Description
                  </h2>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {product.description}
                  </p>
                </div>

                <Separator />

                <AddToCart
                  productId={String(product._id)}
                  name={product.name}
                  price={Number(product.price)}
                  image={images[0] || "/placeholder.svg"}
                  sizes={product.sizes || []}
                  defaultSize={defaultSize}
                  colors={
                    Array.isArray(product.colors) && product.colors.length > 0
                      ? product.colors
                      : ["Black"]
                  }
                  defaultColor={
                    Array.isArray(product.colors) && product.colors.length > 0
                      ? product.colors[0]
                      : "Black"
                  }
                  stock={stock}
                  category={(product.category || []).join(", ")}
                  className="w-full"
                  size="lg"
                />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
