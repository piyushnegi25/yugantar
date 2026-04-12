import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Banner, { type BannerPosition } from "@/lib/models/Banner";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { getUserFromToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID_POSITIONS: BannerPosition[] = [
  "home_hero",
  "home_feature",
  "collections_hero",
  "anime_hero",
  "meme_hero",
];

async function checkAdminAuth(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await getUserFromToken(token);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  return user;
}

function getPublicIdFromUrl(url: string): string {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");
    if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
      const pathParts = parts.slice(uploadIndex + 2);
      const fullPath = pathParts.join("/");
      return fullPath.replace(/\.[^/.]+$/, "");
    }

    const filename = parts[parts.length - 1] || "";
    return filename.split(".")[0];
  } catch {
    return url;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position");
    const admin = searchParams.get("admin") === "true";
    const limitParam = searchParams.get("limit");

    if (admin) {
      const authResult = await checkAdminAuth(request);
      if (authResult instanceof NextResponse) {
        return authResult;
      }
    }

    if (position && !VALID_POSITIONS.includes(position as BannerPosition)) {
      return NextResponse.json({ error: "Invalid banner position" }, { status: 400 });
    }

    const filter: Record<string, unknown> = {};
    if (position) {
      filter.position = position;
    }
    if (!admin) {
      filter.isActive = true;
    }

    let query = Banner.find(filter).sort({ position: 1, order: 1, createdAt: -1 });
    if (limitParam) {
      const limit = Number.parseInt(limitParam, 10);
      if (Number.isFinite(limit) && limit > 0) {
        query = query.limit(limit);
      }
    }

    const banners = await query.lean();
    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const formData = await request.formData();
    const name = ((formData.get("name") as string) || "").trim();
    const position = (formData.get("position") as string) as BannerPosition;
    const alt = ((formData.get("alt") as string) || "Homepage banner").trim();
    const title = ((formData.get("title") as string) || "").trim();
    const subtitle = ((formData.get("subtitle") as string) || "").trim();
    const ctaText = ((formData.get("ctaText") as string) || "").trim();
    const linkUrl = ((formData.get("linkUrl") as string) || "/collections").trim();
    const order = Number.parseInt((formData.get("order") as string) || "1", 10);
    const isActive = (formData.get("isActive") as string) === "true";
    const imageFile = formData.get("image") as File | null;

    if (!name || !position || !VALID_POSITIONS.includes(position)) {
      return NextResponse.json(
        { error: "Name and a valid position are required" },
        { status: 400 }
      );
    }

    if (!imageFile || imageFile.size <= 0) {
      return NextResponse.json(
        { error: "Banner image is required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = (await uploadImage(buffer, "homepage-banners")) as {
      secure_url: string;
    };

    const banner = await Banner.create({
      name,
      position,
      image: uploadResult.secure_url,
      alt,
      title: title || undefined,
      subtitle: subtitle || undefined,
      ctaText: ctaText || undefined,
      linkUrl,
      order: Number.isFinite(order) ? order : 1,
      isActive,
    });

    return NextResponse.json({ message: "Banner created successfully", banner });
  } catch (error) {
    console.error("Error creating banner:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const formData = await request.formData();
    const bannerId = formData.get("bannerId") as string;
    const name = ((formData.get("name") as string) || "").trim();
    const position = (formData.get("position") as string) as BannerPosition;
    const alt = ((formData.get("alt") as string) || "Homepage banner").trim();
    const title = ((formData.get("title") as string) || "").trim();
    const subtitle = ((formData.get("subtitle") as string) || "").trim();
    const ctaText = ((formData.get("ctaText") as string) || "").trim();
    const linkUrl = ((formData.get("linkUrl") as string) || "/collections").trim();
    const order = Number.parseInt((formData.get("order") as string) || "1", 10);
    const isActive = (formData.get("isActive") as string) === "true";
    const imageFile = formData.get("image") as File | null;

    if (!bannerId || !name || !position || !VALID_POSITIONS.includes(position)) {
      return NextResponse.json(
        { error: "Banner ID, name and valid position are required" },
        { status: 400 }
      );
    }

    const existingBanner = await Banner.findById(bannerId);
    if (!existingBanner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    let imageUrl = existingBanner.image;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResult = (await uploadImage(buffer, "homepage-banners")) as {
        secure_url: string;
      };
      imageUrl = uploadResult.secure_url;

      try {
        const publicId = getPublicIdFromUrl(existingBanner.image);
        await deleteImage(publicId);
      } catch (error) {
        console.warn("Failed to delete previous banner image:", error);
      }
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      bannerId,
      {
        name,
        position,
        image: imageUrl,
        alt,
        title: title || undefined,
        subtitle: subtitle || undefined,
        ctaText: ctaText || undefined,
        linkUrl,
        order: Number.isFinite(order) ? order : 1,
        isActive,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Banner updated successfully",
      banner: updatedBanner,
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const bannerId = searchParams.get("bannerId");
    if (!bannerId) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
    }

    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    try {
      const publicId = getPublicIdFromUrl(banner.image);
      await deleteImage(publicId);
    } catch (error) {
      console.warn("Failed to delete banner image from Cloudinary:", error);
    }

    await Banner.findByIdAndDelete(bannerId);

    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
