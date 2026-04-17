import Link from "next/link";
import { DynamicNavbar } from "@/components/dynamic-navbar";
import { UserMenu } from "@/components/auth/user-menu";
import { CartBadge } from "@/components/cart-badge";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SiteHeaderProps {
  currentPath?: string;
  showCart?: boolean;
}

export function SiteHeader({
  currentPath = "",
  showCart = true,
}: SiteHeaderProps) {
  return (
    <header className="app-shell sticky top-0 z-50 pt-3 sm:pt-4">
      <div className="section-shell overflow-hidden bg-card/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-3 sm:h-[74px] sm:px-5">
          <div className="flex min-w-0 flex-1 items-center">
            <DynamicNavbar currentPath={currentPath} />
          </div>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-xl font-black uppercase tracking-[0.22em] text-foreground sm:text-2xl"
          >
            Yugantar
          </Link>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-border bg-background text-foreground hover:bg-muted"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <UserMenu />
            {showCart ? <CartBadge /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
