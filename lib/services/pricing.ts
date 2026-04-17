import { listProducts } from "@/lib/data/products";
import type { IProduct } from "@/lib/domain/types";

export interface PricedCheckoutItem {
  productId: string;
  title: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

function normalizeTitle(input: unknown): string {
  return String(input || "").trim();
}

function normalizeImage(input: unknown): string {
  return String(input || "").trim();
}

function normalizeSize(input: unknown): string {
  return String(input || "").trim();
}

export async function buildPricedCheckoutItems(
  items: unknown
): Promise<PricedCheckoutItem[] | null> {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const normalized = items.map((item) => ({
    productId: String(item?.productId || "").trim(),
    title: normalizeTitle(item?.title),
    image: normalizeImage(item?.image),
    size: normalizeSize(item?.size),
    quantity: Number(item?.quantity),
  }));

  if (
    normalized.some(
      (item) =>
        !item.productId ||
        !item.title ||
        !item.image ||
        !item.size ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
    )
  ) {
    return null;
  }

  const productIds = Array.from(new Set(normalized.map((item) => item.productId)));
  const products = (await listProducts({ isActive: true })).filter((product) =>
    productIds.includes(product._id.toString())
  );

  if (products.length !== productIds.length) {
    return null;
  }

  const productMap = new Map<string, IProduct>(
    products.map((product) => [String(product._id), product])
  );

  const pricedItems: PricedCheckoutItem[] = [];

  for (const item of normalized) {
    const product = productMap.get(item.productId);
    if (!product) {
      return null;
    }

    const trustedImage =
      (Array.isArray(product.images) && product.images[0]) || item.image;

    pricedItems.push({
      productId: item.productId,
      title: product.name || item.title,
      image: trustedImage,
      size: item.size,
      quantity: item.quantity,
      price: Number(product.price),
    });
  }

  return pricedItems;
}

export function computeOrderTotals(items: PricedCheckoutItem[]) {
  const subtotal = Number(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );
  const shipping = subtotal > 1199 ? 0 : 99;
  const total = Number((subtotal + shipping).toFixed(2));

  return { subtotal, shipping, total };
}
