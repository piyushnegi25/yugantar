import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { requireAdminUser } from "@/lib/security/auth-guards";
import {
  normalizeStringList,
  parsePrice,
  sanitizeName,
  validateImageUrls,
} from "@/lib/security/validation";
import { validateImageFiles } from "@/lib/security/upload";

export const dynamic = "force-dynamic";

// Auth check function
async function checkAdminAuth(request: NextRequest) {
  const auth = await requireAdminUser(request);
  return auth.error || auth.user;
}

// Utility function to convert string to slug
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Utility function to extract public ID from Cloudinary URL
function getPublicIdFromUrl(url: string): string {
  try {
    // Handle both old and new Cloudinary URL formats
    // Example: https://res.cloudinary.com/cloud/image/upload/v1234567890/folder/filename.jpg
    const parts = url.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");
    if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
      // Skip 'upload' and version number, get the path after that
      const pathParts = parts.slice(uploadIndex + 2);
      const fullPath = pathParts.join("/");
      // Remove file extension
      return fullPath.replace(/\.[^/.]+$/, "");
    }
    // Fallback: just take filename without extension
    const filename = parts[parts.length - 1];
    return filename.split(".")[0];
  } catch (error) {
    console.warn("Error extracting public ID from URL:", url, error);
    return url;
  }
}

// POST /api/products/admin - Create new product
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await checkAdminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if auth failed
    }

    await connectDB();

    const formData = await request.formData();

    // Extract form fields
    const name = sanitizeName(formData.get("name"));
    const description = String(formData.get("description") || "").trim();
    const price = parsePrice(formData.get("price"));
    const originalPrice = formData.get("originalPrice")
      ? parsePrice(formData.get("originalPrice"))
      : undefined;
    const category = normalizeStringList(formData.get("category"));
    const tags = normalizeStringList(formData.get("tags"));
    const sizes = normalizeStringList(formData.get("sizes"));
    const colors = normalizeStringList(formData.get("colors"));

    // Parse sizeStock from JSON string
    const sizeStockString = formData.get("sizeStock") as string;
    let sizeStockData: Record<string, unknown> = {};

    try {
      sizeStockData = sizeStockString ? JSON.parse(sizeStockString) : {};
    } catch {
      return NextResponse.json(
        { error: "Invalid stock data format" },
        { status: 400 }
      );
    }

    const stock: { [size: string]: number } = {};

    // Convert string values to numbers and ensure all sizes have stock
    sizes.forEach((size) => {
      const rawValue = sizeStockData[size];
      const parsedValue = Number.parseInt(String(rawValue ?? "0"), 10);
      stock[size] = Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
    });

    const isFeatured = formData.get("isFeatured") === "true";
    const hostedImageUrls = normalizeStringList(formData.get("imageUrls"));

    if (
      originalPrice !== undefined &&
      (Number.isNaN(originalPrice) || originalPrice < 0)
    ) {
      return NextResponse.json(
        { error: "Original price must be a valid non-negative number" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !name ||
      !description ||
      Number.isNaN(price) ||
      price <= 0 ||
      !category.length ||
      !sizes.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = createSlug(name);

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 400 }
      );
    }

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[];
    const validImageFiles = (imageFiles || []).filter(
      (file) => file && file.size > 0
    );

    const imageValidation = validateImageFiles(validImageFiles);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { error: imageValidation.error || "Invalid images" },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];

    if (hostedImageUrls.length > 0) {
      if (!validateImageUrls(hostedImageUrls)) {
        return NextResponse.json(
          { error: "Invalid hosted image URLs" },
          { status: 400 }
        );
      }

      imageUrls.push(...hostedImageUrls);
    } else {
      for (const file of validImageFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = (await uploadImage(buffer, "tshirt-products")) as any;
        imageUrls.push(result.secure_url);
      }
    }

    // Create product
    const product = new Product({
      name,
      slug,
      description,
      price,
      originalPrice,
      images: imageUrls,
      category,
      tags,
      sizes,
      colors,
      stock,
      isFeatured,
      isActive: true,
      rating: 0,
      reviews: 0,
    });

    await product.save();

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/admin - Update existing product
export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await checkAdminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if auth failed
    }

    console.log("PUT request received for product update");
    await connectDB();

    const formData = await request.formData();

    // Extract form fields
    const productId = formData.get("productId") as string;
    const name = sanitizeName(formData.get("name"));
    const description = String(formData.get("description") || "").trim();
    const price = parsePrice(formData.get("price"));
    const originalPrice = formData.get("originalPrice")
      ? parsePrice(formData.get("originalPrice"))
      : undefined;
    const category = normalizeStringList(formData.get("category"));
    const tags = normalizeStringList(formData.get("tags"));
    const sizes = normalizeStringList(formData.get("sizes"));
    const colors = normalizeStringList(formData.get("colors"));

    // Parse sizeStock from JSON string for PUT request
    const sizeStockString = formData.get("sizeStock") as string;
    let sizeStockData: Record<string, unknown> = {};

    try {
      sizeStockData = sizeStockString ? JSON.parse(sizeStockString) : {};
    } catch {
      return NextResponse.json(
        { error: "Invalid stock data format" },
        { status: 400 }
      );
    }

    const stock: { [size: string]: number } = {};

    // Convert string values to numbers and ensure all sizes have stock
    sizes.forEach((size) => {
      const rawValue = sizeStockData[size];
      const parsedValue = Number.parseInt(String(rawValue ?? "0"), 10);
      stock[size] = Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
    });

    const isFeatured = formData.get("isFeatured") === "true";
    const isActive = formData.get("isActive") === "true";
    const keepExistingImages = formData.get("keepExistingImages") === "true";
    const hostedImageUrls = normalizeStringList(formData.get("imageUrls"));

    if (
      originalPrice !== undefined &&
      (Number.isNaN(originalPrice) || originalPrice < 0)
    ) {
      return NextResponse.json(
        { error: "Original price must be a valid non-negative number" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !productId ||
      !name ||
      !description ||
      Number.isNaN(price) ||
      price <= 0 ||
      !category.length ||
      !sizes.length
    ) {
      console.error("Validation failed:", {
        productId: !!productId,
        name: !!name,
        description: !!description,
        price: !Number.isNaN(price) && price > 0,
        category: !!category.length,
        sizesLength: sizes.length,
      });
      return NextResponse.json(
        { error: "Missing required fields or invalid data" },
        { status: 400 }
      );
    }

    // Find existing product
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Generate new slug if name changed
    const slug = createSlug(name);

    // Check if new slug conflicts with another product
    if (slug !== existingProduct.slug) {
      const conflictingProduct = await Product.findOne({
        slug,
        _id: { $ne: productId },
      });
      if (conflictingProduct) {
        return NextResponse.json(
          { error: "A product with this name already exists" },
          { status: 400 }
        );
      }
    }

    let imageUrls = existingProduct.images;

    // Handle image updates
    if (!keepExistingImages) {
      const newImageFiles = formData.getAll("newImages") as File[];

      const validNewImageFiles = (newImageFiles || []).filter(
        (file) => file && file.size > 0
      );

      const imageValidation = validateImageFiles(validNewImageFiles);
      if (!imageValidation.valid && hostedImageUrls.length === 0) {
        return NextResponse.json(
          { error: imageValidation.error || "Invalid images" },
          { status: 400 }
        );
      }

      if (hostedImageUrls.length > 0) {
        if (!validateImageUrls(hostedImageUrls)) {
          return NextResponse.json(
            { error: "Invalid hosted image URLs" },
            { status: 400 }
          );
        }

        imageUrls = hostedImageUrls;
      } else if (validNewImageFiles.length > 0) {
        // Delete old images from Cloudinary
        for (const oldImageUrl of existingProduct.images) {
          try {
            const publicId = getPublicIdFromUrl(oldImageUrl);
            await deleteImage(publicId);
          } catch (error) {
            console.warn("Failed to delete old image:", error);
          }
        }

        // Upload new images
        imageUrls = [];
        for (const file of validNewImageFiles) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const result = (await uploadImage(buffer, "tshirt-products")) as any;
          imageUrls.push(result.secure_url);
        }
      }
    } else if (hostedImageUrls.length > 0) {
      if (!validateImageUrls(hostedImageUrls)) {
        return NextResponse.json(
          { error: "Invalid hosted image URLs" },
          { status: 400 }
        );
      }

      imageUrls = hostedImageUrls;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        slug,
        description,
        price,
        originalPrice,
        images: imageUrls,
        category,
        tags,
        sizes,
        colors,
        stock,
        isFeatured,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        error: `Failed to update product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/admin - Delete product
export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await checkAdminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if auth failed
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find and delete product
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete images from Cloudinary
    for (const imageUrl of product.images) {
      try {
        const publicId = getPublicIdFromUrl(imageUrl);
        await deleteImage(publicId);
      } catch (error) {
        console.warn("Failed to delete image:", error);
      }
    }

    // Delete product from database
    await Product.findByIdAndDelete(productId);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
