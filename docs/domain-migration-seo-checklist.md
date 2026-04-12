# Domain Migration SEO Checklist (StyleSage -> Yugantar)

Use this checklist when you switch from `stylesage` to `yugantar`.

## 1) Before Launch
- Add the new domain in hosting and SSL setup.
- Set `NEXT_PUBLIC_APP_URL` to the new canonical domain.
- Optionally set `NEXT_PUBLIC_FUTURE_DOMAIN` for reference.
- Keep page paths and content structure stable during migration.

## 2) Redirects
- Add permanent `301` redirects from every old URL to the matching new URL.
- Redirect with path/query preserved.
- Ensure `www` and non-`www` variants resolve to one canonical host.

## 3) Canonicals + Metadata
- Verify canonical tags point to the new domain.
- Verify `robots.txt` host/sitemap reference new domain.
- Verify Open Graph and Twitter URLs use the new domain.

## 4) Sitemaps + Crawlers
- Keep `/sitemap.xml` live on the new domain.
- Keep `/llms.txt` and `/robots.txt` live on the new domain.
- Keep old sitemap URL redirecting to the new sitemap URL.

## 5) Search Console (when available)
- Add/verify the new property.
- Submit new sitemap URL.
- Use change-of-address flow for old property (if available).

## 6) Post-Migration QA
- Crawl top URLs and verify 200 on new + 301 from old.
- Check no redirect chains (single-hop redirects).
- Monitor indexing, clicks, and crawl errors for 4-8 weeks.
