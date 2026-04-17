import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/seo";
import { listProducts } from "@/lib/data/products";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const products = await listProducts({ isActive: true });

    const urls = products
      .filter((product) => typeof product.slug === "string" && product.slug.trim())
      .map((product) => {
        const loc = absoluteUrl(`/products/${product.slug}`);
        const lastmod = new Date(product.updatedAt || new Date()).toISOString();
        return `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Failed to generate product sitemap:", error);
    return new NextResponse("<?xml version=\"1.0\" encoding=\"UTF-8\"?><urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"></urlset>", {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=300",
      },
    });
  }
}
