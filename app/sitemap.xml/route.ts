import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${absoluteUrl("/sitemap-static.xml")}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${absoluteUrl("/sitemap-products.xml")}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
