import connectDB from "./mongodb";
import { initializeDefaultAdmin } from "./auth";
import Category from "./models/Category";
import Product from "./models/Product";
import Banner from "./models/Banner";

export async function initializeDatabase() {
  try {
    await connectDB();
    console.log("🔄 Initializing database...");

    // Initialize default admin
    await initializeDefaultAdmin();

    // Initialize default categories
    await initializeDefaultCategories();

    // Migrate existing products to new stock structure
    await migrateProductStock();

    // Initialize homepage banners
    await initializeDefaultBanners();

    // Initialize sample products - DISABLED to prevent automatic t-shirt generation
    // await initializeSampleProducts();

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

async function initializeDefaultBanners() {
  const defaultBanners = [
    {
      name: "Hero Banner 1",
      position: "home_hero",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2070&auto=format&fit=crop",
      alt: "Streetwear hero model",
      title: "Till End of the Era",
      subtitle: "Premium oversized streetwear and graphic tees",
      ctaText: "Shop Collection",
      linkUrl: "/collections",
      order: 1,
      isActive: true,
    },
    {
      name: "Hero Banner 2",
      position: "home_hero",
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop",
      alt: "Urban fashion collection",
      title: "Wear Your Story",
      subtitle: "Statement pieces for everyday style",
      ctaText: "Explore Drops",
      linkUrl: "/collections",
      order: 2,
      isActive: true,
    },
    {
      name: "Feature Banner",
      position: "home_feature",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop",
      alt: "Centre Stage Collection",
      title: "Centre Stage Collection",
      subtitle: "Curated drops built for bold fits and everyday wear.",
      ctaText: "Explore Now",
      linkUrl: "/collections/centre-stage",
      order: 1,
      isActive: true,
    },
    {
      name: "Collections Hero Banner",
      position: "collections_hero",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      alt: "Collections hero banner",
      title: "Curated Collections",
      subtitle:
        "Explore our exclusive collections of t-shirts, hand-picked for every style and occasion.",
      ctaText: "Shop Collection",
      linkUrl: "/collections",
      order: 1,
      isActive: true,
    },
    {
      name: "Anime Hero Banner",
      position: "anime_hero",
      image:
        "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=2070&auto=format&fit=crop",
      alt: "Anime hero banner",
      title: "Anime Collection",
      subtitle:
        "Express your otaku spirit with our premium anime-inspired designs.",
      ctaText: "Explore Anime",
      linkUrl: "/anime",
      order: 1,
      isActive: true,
    },
    {
      name: "Meme Hero Banner",
      position: "meme_hero",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2070&auto=format&fit=crop",
      alt: "Meme hero banner",
      title: "Meme Collection",
      subtitle:
        "Spread the laughs with our hilarious meme-inspired designs.",
      ctaText: "Explore Memes",
      linkUrl: "/meme",
      order: 1,
      isActive: true,
    },
  ] as const;

  for (const bannerData of defaultBanners) {
    const exists = await Banner.findOne({
      name: bannerData.name,
      position: bannerData.position,
    });

    if (!exists) {
      await Banner.create(bannerData);
      console.log(`✅ Created banner: ${bannerData.name}`);
    }
  }
}

async function initializeDefaultCategories() {
  const defaultCategories = [
    {
      name: "Collections",
      slug: "collections",
      description: "Our curated collections",
      isActive: true,
      order: 1,
    },
    {
      name: "Anime",
      slug: "anime",
      description: "Anime-inspired designs",
      isActive: true,
      order: 2,
    },
    {
      name: "Meme",
      slug: "meme",
      description: "Internet meme designs",
      isActive: true,
      order: 3,
    },
    {
      name: "Custom",
      slug: "custom",
      description: "Create your own design",
      isActive: true,
      order: 4,
    },
  ];

  for (const categoryData of defaultCategories) {
    const exists = await Category.findOne({ slug: categoryData.slug });
    if (!exists) {
      await Category.create(categoryData);
      console.log(`✅ Created category: ${categoryData.name}`);
    }
  }
}

async function migrateProductStock() {
  try {
    // Find all products that have old numeric stock structure
    const products = await Product.find({});

    for (const product of products) {
      // Check if stock is a number (old structure)
      if (typeof product.stock === "number") {
        console.log(`🔄 Migrating stock for product: ${product.name}`);

        // Create new stock structure based on sizes
        const newStock: { [size: string]: number } = {};
        const stockPerSize = Math.floor(product.stock / product.sizes.length);
        const remainder = product.stock % product.sizes.length;

        product.sizes.forEach((size: string, index: number) => {
          newStock[size] = stockPerSize + (index < remainder ? 1 : 0);
        });

        // Update the product with new stock structure
        await Product.updateOne(
          { _id: product._id },
          { $set: { stock: newStock } }
        );

        console.log(
          `✅ Migrated stock for ${product.name}: ${JSON.stringify(newStock)}`
        );
      }
    }

    console.log("✅ Stock migration completed");
  } catch (error) {
    console.error("❌ Stock migration failed:", error);
    throw error;
  }
}

async function initializeSampleProducts() {
  const sampleProducts = [
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
    {
      name: "Naruto Hokage Dreams",
      slug: "naruto-hokage-dreams",
      description: "Iconic Naruto design featuring the path to becoming Hokage",
      price: 48,
      originalPrice: 55,
      images: ["/placeholder.svg?height=400&width=400&text=Naruto+Design"],
      category: ["anime"],
      tags: ["naruto", "anime", "hokage"],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
      colors: [],
      stock: {
        XS: 8,
        S: 12,
        M: 15,
        L: 15,
        XL: 12,
        "2XL": 8,
        "3XL": 3,
        "4XL": 2,
        "5XL": 0,
      },
      isActive: true,
      isFeatured: true,
      rating: 4.9,
      reviews: 234,
    },
    {
      name: "This is Fine Dog",
      slug: "this-is-fine-dog",
      description: "Perfect for when everything is definitely fine",
      price: 47,
      images: ["/placeholder.svg?height=400&width=400&text=This+Is+Fine"],
      category: ["meme"],
      tags: ["meme", "dog", "fine"],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
      colors: [],
      stock: {
        XS: 5,
        S: 8,
        M: 12,
        L: 12,
        XL: 8,
        "2XL": 3,
        "3XL": 2,
        "4XL": 0,
        "5XL": 0,
      },
      isActive: true,
      isFeatured: true,
      rating: 4.9,
      reviews: 623,
    },
    {
      name: "Custom Design T-Shirt",
      slug: "custom-design-basic",
      description:
        "Create your own unique design with our premium custom t-shirt service",
      price: 55,
      images: ["/placeholder.svg?height=400&width=400&text=Custom+Design"],
      category: "custom",
      tags: ["custom", "personalized", "design"],
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
      colors: [
        "White",
        "Black",
        "Navy",
        "Red",
        "Green",
        "Blue",
        "Gray",
        "Pink",
      ],
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
      rating: 4.9,
      reviews: 89,
    },
  ];

  for (const productData of sampleProducts) {
    const exists = await Product.findOne({ slug: productData.slug });
    if (!exists) {
      await Product.create(productData);
      console.log(`✅ Created product: ${productData.name}`);
    }
  }
}
