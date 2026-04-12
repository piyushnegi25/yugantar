import { useState, useEffect } from "react";

interface StockCheckResult {
  stock: number;
  isLoading: boolean;
  error: string | null;
}

export function useStockCheck(
  productId: string,
  size: string,
  enabled: boolean = true
): StockCheckResult {
  const [stock, setStock] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !productId || !size) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const checkStock = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/products/stock?productId=${encodeURIComponent(
            productId
          )}&size=${encodeURIComponent(size)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!isMounted) {
          return;
        }

        if (data.success) {
          setStock(data.stock);
        } else {
          setError(data.error || "Failed to check stock");
          setStock(0);
        }
      } catch (err) {
        if ((err as Error)?.name === "AbortError") {
          return;
        }

        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to check stock");
        setStock(0);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkStock();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [productId, size, enabled]);

  return { stock, isLoading, error };
}

export default useStockCheck;
