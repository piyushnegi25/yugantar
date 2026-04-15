import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { requireAdminUser } from "@/lib/security/auth-guards";

async function checkAdminAuth(request: NextRequest) {
  const auth = await requireAdminUser(request);
  return auth.error || auth.user;
}

// Updated sample product data with proper Cloudinary URLs for demonstration
const sampleProductsUpdated = [
  // Anime Products
  {
    name: "Naruto Hokage Dreams",
    slug: "naruto-hokage-dreams",
    description:
      "Iconic Naruto design featuring the path to becoming Hokage. High-quality print on premium cotton blend fabric.",
    price: 48,
    originalPrice: 55,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/sample.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/woman.jpg",
    ],
    category: ["anime"],
    tags: ["naruto", "hokage", "anime", "manga", "bestseller"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 50,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 234,
  },
  {
    name: "Attack on Titan Wings",
    slug: "attack-on-titan-wings",
    description:
      "Survey Corps wings of freedom design. Perfect for AOT fans who fight for humanity.",
    price: 52,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/nature/forest.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/landscape.jpg",
    ],
    category: ["anime"],
    tags: ["attack-on-titan", "aot", "survey-corps", "anime", "new"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 35,
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    reviews: 189,
  },
  {
    name: "Dragon Ball Z Power",
    slug: "dragon-ball-z-power",
    description:
      "Feel the power of the Saiyans with this incredible DBZ design featuring energy auras.",
    price: 50,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/basketball_shot.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/athlete.jpg",
    ],
    category: ["anime"],
    tags: ["dragon-ball-z", "dbz", "saiyan", "goku", "anime"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 42,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 312,
  },
  {
    name: "One Piece Jolly Roger",
    slug: "one-piece-jolly-roger",
    description:
      "Sail the Grand Line with the Straw Hat Pirates. Premium quality design for true nakama.",
    price: 47,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/ocean.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/beach.jpg",
    ],
    category: ["anime"],
    tags: ["one-piece", "luffy", "straw-hat", "pirate", "anime"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 28,
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviews: 156,
  },
  {
    name: "Demon Slayer Breathe",
    slug: "demon-slayer-breathe",
    description:
      "Channel your inner demon slayer with this stunning breathing technique design.",
    price: 49,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/nature/tree.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/leaves.jpg",
    ],
    category: ["anime"],
    tags: ["demon-slayer", "tanjiro", "breathing", "anime", "trending"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 33,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviews: 203,
  },
  {
    name: "My Hero Academia Plus Ultra",
    slug: "my-hero-academia-plus-ultra",
    description:
      "Go beyond with All Might's legendary phrase. Perfect for aspiring heroes.",
    price: 46,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/city.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/building.jpg",
    ],
    category: ["anime"],
    tags: ["my-hero-academia", "all-might", "plus-ultra", "hero", "anime"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 45,
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviews: 178,
  },

  // Custom Products
  {
    name: "Custom Design T-Shirt",
    slug: "custom-design-tshirt",
    description:
      "Create your own unique design with our premium custom t-shirt service. Upload your own image or text.",
    price: 55,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/nature/landscape.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/nature/forest.jpg",
    ],
    category: ["custom"],
    tags: ["custom", "personalized", "design", "unique"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy", "Red", "Green", "Blue", "Gray", "Pink"],
    stock: 100,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 89,
  },

  // Meme Products
  {
    name: "Distracted Boyfriend Classic",
    slug: "distracted-boyfriend-classic",
    description:
      "The iconic distracted boyfriend meme in premium print. Perfect conversation starter.",
    price: 45,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/couple.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/man.jpg",
    ],
    category: ["meme"],
    tags: ["distracted-boyfriend", "classic-meme", "viral", "funny"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 60,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviews: 456,
  },
  {
    name: "This is Fine Dog",
    slug: "this-is-fine-dog",
    description:
      "Perfect for when everything is definitely fine. The ultimate comfort meme tee.",
    price: 47,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/puppy.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/dog.jpg",
    ],
    category: ["meme"],
    tags: ["this-is-fine", "dog", "fire", "classic-meme", "bestseller"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 55,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 623,
  },
  {
    name: "Drake Pointing Choice",
    slug: "drake-pointing-choice",
    description:
      "Make your preferences clear with the classic Drake pointing meme format.",
    price: 44,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/accessories_bag.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/shoes.jpg",
    ],
    category: ["meme"],
    tags: ["drake", "pointing", "choice", "meme", "popular"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 38,
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviews: 289,
  },
  {
    name: "Woman Yelling at Cat",
    slug: "woman-yelling-at-cat",
    description:
      "The perfect dinner table drama captured in meme form. Salad cat included.",
    price: 46,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/cat.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/kitten.jpg",
    ],
    category: ["meme"],
    tags: ["woman-yelling", "cat", "dinner", "viral-meme", "funny"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 41,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviews: 367,
  },
  {
    name: "Stonks Man",
    slug: "stonks-man",
    description:
      "When your investments are definitely going up. Financial advice not included.",
    price: 48,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/coffee.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/coffee_cup.jpg",
    ],
    category: ["meme"],
    tags: ["stonks", "stocks", "investment", "meme-man", "finance"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 29,
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviews: 198,
  },
  {
    name: "Surprised Pikachu",
    slug: "surprised-pikachu",
    description:
      "Express your shock and disbelief with the most surprised Pokémon ever.",
    price: 43,
    images: [
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/yellow_flower.jpg",
      "https://res.cloudinary.com/demo/image/upload/w_800,h_800,c_fit/animals/bird.jpg",
    ],
    category: ["meme"],
    tags: ["pikachu", "surprised", "pokemon", "shocked", "classic"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 52,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 534,
  },
];

// Sample product data with Cloudinary URLs (you'll need to replace these with actual Cloudinary URLs)
const sampleProducts = [
  // Anime Products
  {
    name: "Naruto Hokage Dreams",
    slug: "naruto-hokage-dreams",
    description:
      "Iconic Naruto design featuring the path to becoming Hokage. High-quality print on premium cotton blend fabric.",
    price: 48,
    originalPrice: 55,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/naruto-hokage-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/naruto-hokage-2.jpg",
    ],
    category: ["anime"],
    tags: ["naruto", "hokage", "anime", "manga", "bestseller"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 50,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 234,
  },
  {
    name: "Attack on Titan Wings",
    slug: "attack-on-titan-wings",
    description:
      "Survey Corps wings of freedom design. Perfect for AOT fans who fight for humanity.",
    price: 52,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/aot-wings-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/aot-wings-2.jpg",
    ],
    category: ["anime"],
    tags: ["attack-on-titan", "aot", "survey-corps", "anime", "new"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 35,
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    reviews: 189,
  },
  {
    name: "Dragon Ball Z Power",
    slug: "dragon-ball-z-power",
    description:
      "Feel the power of the Saiyans with this incredible DBZ design featuring energy auras.",
    price: 50,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/dbz-power-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/dbz-power-2.jpg",
    ],
    category: ["anime"],
    tags: ["dragon-ball-z", "dbz", "saiyan", "goku", "anime"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 42,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 312,
  },
  {
    name: "One Piece Jolly Roger",
    slug: "one-piece-jolly-roger",
    description:
      "Sail the Grand Line with the Straw Hat Pirates. Premium quality design for true nakama.",
    price: 47,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/one-piece-roger-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/one-piece-roger-2.jpg",
    ],
    category: ["anime"],
    tags: ["one-piece", "luffy", "straw-hat", "pirate", "anime"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 28,
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviews: 156,
  },
  {
    name: "Demon Slayer Breathe",
    slug: "demon-slayer-breathe",
    description:
      "Channel your inner demon slayer with this stunning breathing technique design.",
    price: 49,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/demon-slayer-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/demon-slayer-2.jpg",
    ],
    category: ["anime"],
    tags: ["demon-slayer", "tanjiro", "breathing", "anime", "trending"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 33,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviews: 203,
  },
  {
    name: "My Hero Academia Plus Ultra",
    slug: "my-hero-academia-plus-ultra",
    description:
      "Go beyond with All Might's legendary phrase. Perfect for aspiring heroes.",
    price: 46,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/mha-plus-ultra-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/mha-plus-ultra-2.jpg",
    ],
    category: ["anime"],
    tags: ["my-hero-academia", "all-might", "plus-ultra", "hero", "anime"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 45,
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviews: 178,
  },

  // Custom Products
  {
    name: "Custom Design T-Shirt",
    slug: "custom-design-tshirt-v2",
    description:
      "Create your own unique design with our premium custom t-shirt service. Upload your own image or text.",
    price: 55,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/custom-design-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/custom-design-2.jpg",
    ],
    category: ["custom"],
    tags: ["custom", "personalized", "design", "unique"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Navy", "Red", "Green", "Blue", "Gray", "Pink"],
    stock: 100,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 89,
  },

  // Meme Products
  {
    name: "Distracted Boyfriend Classic",
    slug: "distracted-boyfriend-classic",
    description:
      "The iconic distracted boyfriend meme in premium print. Perfect conversation starter.",
    price: 45,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/distracted-boyfriend-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/distracted-boyfriend-2.jpg",
    ],
    category: ["meme"],
    tags: ["distracted-boyfriend", "classic-meme", "viral", "funny"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 60,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviews: 456,
  },
  {
    name: "This is Fine Dog",
    slug: "this-is-fine-dog",
    description:
      "Perfect for when everything is definitely fine. The ultimate comfort meme tee.",
    price: 47,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/this-is-fine-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/this-is-fine-2.jpg",
    ],
    category: ["meme"],
    tags: ["this-is-fine", "dog", "fire", "classic-meme", "bestseller"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 55,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 623,
  },
  {
    name: "Drake Pointing Choice",
    slug: "drake-pointing-choice",
    description:
      "Make your preferences clear with the classic Drake pointing meme format.",
    price: 44,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/drake-pointing-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/drake-pointing-2.jpg",
    ],
    category: ["meme"],
    tags: ["drake", "pointing", "choice", "meme", "popular"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 38,
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviews: 289,
  },
  {
    name: "Woman Yelling at Cat",
    slug: "woman-yelling-at-cat",
    description:
      "The perfect dinner table drama captured in meme form. Salad cat included.",
    price: 46,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/woman-cat-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/woman-cat-2.jpg",
    ],
    category: ["meme"],
    tags: ["woman-yelling", "cat", "dinner", "viral-meme", "funny"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 41,
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviews: 367,
  },
  {
    name: "Stonks Man",
    slug: "stonks-man",
    description:
      "When your investments are definitely going up. Financial advice not included.",
    price: 48,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/stonks-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/stonks-2.jpg",
    ],
    category: ["meme"],
    tags: ["stonks", "stocks", "investment", "meme-man", "finance"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 29,
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviews: 198,
  },
  {
    name: "Surprised Pikachu",
    slug: "surprised-pikachu",
    description:
      "Express your shock and disbelief with the most surprised Pokémon ever.",
    price: 43,
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/surprised-pikachu-1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v1234567890/tshirt-products/surprised-pikachu-2.jpg",
    ],
    category: ["meme"],
    tags: ["pikachu", "surprised", "pokemon", "shocked", "classic"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [],
    stock: 52,
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviews: 534,
  },
];

// POST /api/products/seed - Seed sample data (Admin only for safety)
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    // For safety, let's add a simple check
    const body = await request.json();
    const { confirm } = body;

    if (confirm !== "SEED_SAMPLE_DATA") {
      return NextResponse.json(
        { error: "Confirmation required" },
        { status: 400 }
      );
    }

    // Check if products already exist
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          error:
            "Products already exist. Clear the database first if you want to reseed.",
        },
        { status: 400 }
      );
    }

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedProducts.length} products`,
      products: insertedProducts.length,
    });
  } catch (error) {
    console.error("Error seeding products:", error);
    return NextResponse.json(
      { error: "Failed to seed products" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/seed - Clear all products (for testing)
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const body = await request.json();
    const { confirm } = body;

    if (confirm !== "CLEAR_ALL_PRODUCTS") {
      return NextResponse.json(
        { error: "Confirmation required" },
        { status: 400 }
      );
    }

    const result = await Product.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} products`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error clearing products:", error);
    return NextResponse.json(
      { error: "Failed to clear products" },
      { status: 500 }
    );
  }
}

// PUT /api/products/seed - Update existing products with better images
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const body = await request.json();
    const { confirm } = body;

    if (confirm !== "UPDATE_PRODUCT_IMAGES") {
      return NextResponse.json(
        { error: "Confirmation required" },
        { status: 400 }
      );
    }

    let updatedCount = 0;

    for (const productData of sampleProductsUpdated) {
      const existingProduct = await Product.findOne({ slug: productData.slug });

      if (existingProduct) {
        existingProduct.images = productData.images;
        existingProduct.description = productData.description;
        existingProduct.tags = productData.tags;
        // Convert number stock to size-specific stock if needed
        if (typeof productData.stock === "number") {
          const stockPerSize = Math.floor(
            productData.stock / existingProduct.sizes.length
          );
          const stockObj: { [size: string]: number } = {};
          existingProduct.sizes.forEach((size) => {
            stockObj[size] = stockPerSize;
          });
          existingProduct.stock = stockObj;
        } else {
          existingProduct.stock = productData.stock;
        }
        existingProduct.isFeatured = productData.isFeatured;
        await existingProduct.save();
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} products with better images and data`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error updating products:", error);
    return NextResponse.json(
      { error: "Failed to update products" },
      { status: 500 }
    );
  }
}
