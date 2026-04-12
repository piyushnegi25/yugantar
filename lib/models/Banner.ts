import mongoose, { type Document, Schema } from "mongoose";

export type BannerPosition =
  | "home_hero"
  | "home_feature"
  | "collections_hero"
  | "anime_hero"
  | "meme_hero";

export interface IBanner extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      enum: [
        "home_hero",
        "home_feature",
        "collections_hero",
        "anime_hero",
        "meme_hero",
      ],
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      default: "Homepage banner",
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    ctaText: {
      type: String,
      trim: true,
    },
    linkUrl: {
      type: String,
      default: "/collections",
      trim: true,
    },
    order: {
      type: Number,
      default: 1,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

BannerSchema.index({ position: 1, isActive: 1, order: 1 });

export default (mongoose.models?.Banner as mongoose.Model<IBanner>) ||
  mongoose.model<IBanner>("Banner", BannerSchema);
