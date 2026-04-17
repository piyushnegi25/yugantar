import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = absoluteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/auth/callback/*",
          "/cart",
          "/checkout",
          "/orders",
          "/payment",
          "/success",
          "/debug-navbar",
          "/image-test",
          "/test-db",
          "/private/*",
          "/tmp/*",
          "/logs/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/auth/callback/*",
          "/cart",
          "/checkout",
          "/orders",
          "/payment",
          "/success",
          "/debug-navbar",
          "/image-test",
          "/test-db",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/auth/callback/*",
          "/cart",
          "/checkout",
          "/orders",
          "/payment",
          "/success",
          "/debug-navbar",
          "/image-test",
          "/test-db",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      {
        userAgent: "FacebookBot",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
        disallow: ["/admin", "/api", "/auth/callback/*"],
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: ["/admin", "/api", "/auth/callback/*"],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-static.xml`,
      `${baseUrl}/sitemap-products.xml`,
    ],
  };
}
