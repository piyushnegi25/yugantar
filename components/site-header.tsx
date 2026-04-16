import Link from "next/link";
import { DynamicNavbar } from "@/components/dynamic-navbar";
import { UserMenu } from "@/components/auth/user-menu";
import { CartBadge } from "@/components/cart-badge";

interface SiteHeaderProps {
  currentPath?: string;
  showCart?: boolean;
}

export function SiteHeader({
  currentPath = "",
  showCart = true,
}: SiteHeaderProps) {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Yugantar
            </Link>
            <DynamicNavbar currentPath={currentPath} />
          </div>

          <div className="flex items-center space-x-4">
            <UserMenu />
            {showCart ? <CartBadge /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
