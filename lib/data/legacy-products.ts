import { createProductRecord } from "@/lib/data/products";

export async function ensureDefaultProducts(): Promise<void> {
  const defaultProducts = [
    {
      name: "Essential White Tee",
      slug: "essential-white-tee",
      description: "Classic white t-shirt made from premium organic cotton",
      price: 45,
      images: ["/placeholder.svg?height=400&width=400&text=White+Tee"],
      category: ["collections"],
      tags: ["essential", "basic", "cotton"],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
      colors: [],
      stock: {
        XS: 10,
        S: 15,
        M: 20,
        L: 20,
        XL: 15,
        "2XL": 10,
        "3XL": 5,
        "4XL": 3,
        "5XL": 2,
      },
      isActive: true,
      isFeatured: true,
      rating: 4.8,
      reviews: 156,
    },
  ];

  for (const product of defaultProducts) {
    try {
      await createProductRecord(product);
    } catch {
      // Ignore duplicates during repeated init calls.
    }
  }
}
