"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddressPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to checkout since address is now handled there
    router.push("/checkout");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">
          Redirecting to checkout...
        </p>
      </div>
    </div>
  );
}
