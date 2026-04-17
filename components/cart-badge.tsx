"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

export function CartBadge() {
  const { totalItems, isLoading } = useCart();

  return (
    <Link href="/cart">
      <Button
        variant="outline"
        size="icon"
        className="relative h-10 w-10 rounded-full border-border bg-background text-foreground hover:bg-muted"
      >
        <ShoppingCart className="w-4 h-4" />
        {!isLoading && totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </Badge>
        )}
        <span className="sr-only">Cart with {totalItems} items</span>
      </Button>
    </Link>
  );
}
