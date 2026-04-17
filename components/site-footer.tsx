import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-background py-12 sm:py-16">
      <div className="container mx-auto flex max-w-screen-2xl flex-col items-center text-center">
        <h3 className="mb-4 text-3xl font-black uppercase tracking-tighter text-foreground sm:text-4xl">
          YUGANTAR
        </h3>
        <p className="mb-8 text-xs uppercase tracking-widest text-muted-foreground sm:mb-10 sm:text-sm">
          Till End of the Era.
        </p>
        <div className="grid w-full max-w-[360px] grid-cols-2 justify-center gap-x-4 gap-y-3 text-sm font-medium text-muted-foreground sm:max-w-none sm:flex sm:flex-wrap sm:justify-center sm:gap-8 sm:mb-10">
          <Link href="/about" className="transition-colors hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-primary">
            Contact
          </Link>
          <Link href="/faq" className="transition-colors hover:text-primary">
            FAQ
          </Link>
          <Link href="/shipping" className="transition-colors hover:text-primary">
            Shipping
          </Link>
          <Link
            href="/tshirt-brands-india"
            className="transition-colors hover:text-primary"
          >
            Best Brands
          </Link>
          <Link
            href="/oversized-tshirts-india"
            className="transition-colors hover:text-primary"
          >
            Oversized
          </Link>
          <Link
            href="/anime-tshirts-india"
            className="transition-colors hover:text-primary"
          >
            Anime Tees
          </Link>
          <Link
            href="/graphic-tshirts-india"
            className="transition-colors hover:text-primary"
          >
            Graphic Tees
          </Link>
          <Link
            href="/streetwear-tshirts-india"
            className="transition-colors hover:text-primary"
          >
            Streetwear
          </Link>
          <Link
            href="/funny-meme-tshirts-india"
            className="transition-colors hover:text-primary"
          >
            Funny Memes
          </Link>
        </div>
        <p className="px-4 text-[11px] text-muted-foreground/60 sm:text-xs">
          &copy; {new Date().getFullYear()} YUGANTAR. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
