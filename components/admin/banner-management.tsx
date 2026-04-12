"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BannerPosition =
  | "home_hero"
  | "home_feature"
  | "collections_hero"
  | "anime_hero"
  | "meme_hero";

interface Banner {
  _id: string;
  name: string;
  position: BannerPosition;
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  linkUrl: string;
  order: number;
  isActive: boolean;
}

interface BannerManagementProps {
  banners: Banner[];
  onRefresh: () => Promise<void>;
}

interface BannerFormState {
  name: string;
  position: BannerPosition;
  alt: string;
  title: string;
  subtitle: string;
  ctaText: string;
  linkUrl: string;
  order: number;
  isActive: boolean;
}

const DEFAULT_FORM: BannerFormState = {
  name: "",
  position: "home_hero",
  alt: "Homepage banner",
  title: "",
  subtitle: "",
  ctaText: "",
  linkUrl: "/collections",
  order: 1,
  isActive: true,
};

const positionLabel: Record<BannerPosition, string> = {
  home_hero: "Homepage Hero Carousel",
  home_feature: "Homepage Feature Banner",
  collections_hero: "Collections Hero Banner",
  anime_hero: "Anime Hero Banner",
  meme_hero: "Meme Hero Banner",
};

export function BannerManagement({ banners, onRefresh }: BannerManagementProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerFormState>(DEFAULT_FORM);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const heroBanners = useMemo(
    () => banners.filter((banner) => banner.position === "home_hero"),
    [banners]
  );
  const featureBanners = useMemo(
    () => banners.filter((banner) => banner.position === "home_feature"),
    [banners]
  );
  const collectionsHeroBanners = useMemo(
    () => banners.filter((banner) => banner.position === "collections_hero"),
    [banners]
  );
  const animeHeroBanners = useMemo(
    () => banners.filter((banner) => banner.position === "anime_hero"),
    [banners]
  );
  const memeHeroBanners = useMemo(
    () => banners.filter((banner) => banner.position === "meme_hero"),
    [banners]
  );

  const openCreateDialog = () => {
    setEditingBanner(null);
    setSelectedImage(null);
    setForm(DEFAULT_FORM);
    setIsDialogOpen(true);
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setSelectedImage(null);
    setForm({
      name: banner.name,
      position: banner.position,
      alt: banner.alt,
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      ctaText: banner.ctaText || "",
      linkUrl: banner.linkUrl,
      order: banner.order,
      isActive: banner.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Missing name",
        description: "Banner name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!editingBanner && !selectedImage) {
      toast({
        title: "Missing image",
        description: "Please choose a banner image.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("position", form.position);
      payload.append("alt", form.alt.trim() || "Homepage banner");
      payload.append("title", form.title.trim());
      payload.append("subtitle", form.subtitle.trim());
      payload.append("ctaText", form.ctaText.trim());
      payload.append("linkUrl", form.linkUrl.trim() || "/collections");
      payload.append("order", String(form.order));
      payload.append("isActive", String(form.isActive));

      if (selectedImage) {
        payload.append("image", selectedImage);
      }

      if (editingBanner) {
        payload.append("bannerId", editingBanner._id);
      }

      const response = await fetch("/api/banners", {
        method: editingBanner ? "PUT" : "POST",
        body: payload,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to save banner");
      }

      toast({
        title: "Success",
        description: editingBanner
          ? "Banner updated successfully."
          : "Banner created successfully.",
      });

      setIsDialogOpen(false);
      setSelectedImage(null);
      setEditingBanner(null);
      setForm(DEFAULT_FORM);
      await onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save banner",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm("Delete this banner permanently?")) {
      return;
    }

    try {
      setIsDeleting(bannerId);
      const response = await fetch(`/api/banners?bannerId=${bannerId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete banner");
      }

      toast({ title: "Deleted", description: "Banner deleted successfully." });
      await onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete banner",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const BannerList = ({
    title,
    items,
  }: {
    title: string;
    items: Banner[];
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No banners yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((banner) => (
              <div
                key={banner._id}
                className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center"
              >
                <div className="relative h-24 w-full overflow-hidden rounded-md bg-muted md:w-44">
                  <Image
                    src={banner.image}
                    alt={banner.alt || banner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{banner.name}</p>
                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {positionLabel[banner.position]} • Order {banner.order}
                  </p>
                  <p className="text-xs text-muted-foreground">Link: {banner.linkUrl}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(banner)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(banner._id)}
                    disabled={isDeleting === banner._id}
                  >
                    {isDeleting === banner._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Homepage Banners</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Create Banner"}
              </DialogTitle>
              <DialogDescription>
                Upload images for homepage hero carousel and feature section.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="banner-name">Name</Label>
                  <Input
                    id="banner-name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Summer Hero Banner"
                  />
                </div>
                <div>
                  <Label htmlFor="banner-position">Position</Label>
                  <select
                    id="banner-position"
                    value={form.position}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        position: e.target.value as BannerPosition,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="home_hero">Homepage Hero Carousel</option>
                    <option value="home_feature">Homepage Feature Banner</option>
                    <option value="collections_hero">Collections Hero Banner</option>
                    <option value="anime_hero">Anime Hero Banner</option>
                    <option value="meme_hero">Meme Hero Banner</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="banner-alt">Image Alt Text</Label>
                  <Input
                    id="banner-alt"
                    value={form.alt}
                    onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
                    placeholder="Streetwear campaign banner"
                  />
                </div>
                <div>
                  <Label htmlFor="banner-order">Order</Label>
                  <Input
                    id="banner-order"
                    type="number"
                    min={0}
                    value={form.order}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        order: Number.parseInt(e.target.value || "0", 10),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="banner-title">Overlay Title (optional)</Label>
                  <Input
                    id="banner-title"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="banner-cta">CTA Text (optional)</Label>
                  <Input
                    id="banner-cta"
                    value={form.ctaText}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, ctaText: e.target.value }))
                    }
                    placeholder="Shop Collection"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="banner-subtitle">Subtitle (optional)</Label>
                <Input
                  id="banner-subtitle"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="banner-link">Link URL</Label>
                <Input
                  id="banner-link"
                  value={form.linkUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, linkUrl: e.target.value }))
                  }
                  placeholder="/collections"
                />
              </div>

              <div>
                <Label htmlFor="banner-image">
                  Image {editingBanner ? "(optional when editing)" : "*"}
                </Label>
                <Input
                  id="banner-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setSelectedImage((e.target.files && e.target.files[0]) || null)
                  }
                />
                {selectedImage ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Selected: {selectedImage.name}
                  </p>
                ) : editingBanner ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Keep current image if none selected.
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="banner-active"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isActive: checked }))
                  }
                />
                <Label htmlFor="banner-active">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingBanner ? (
                  "Update Banner"
                ) : (
                  "Create Banner"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <BannerList title="Hero Carousel Slides" items={heroBanners} />
      <BannerList title="Feature Banner" items={featureBanners} />
      <BannerList
        title="Collections Page Hero Banner"
        items={collectionsHeroBanners}
      />
      <BannerList title="Anime Page Hero Banner" items={animeHeroBanners} />
      <BannerList title="Meme Page Hero Banner" items={memeHeroBanners} />
    </div>
  );
}
