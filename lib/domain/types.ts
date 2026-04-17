export type UserRole = "user" | "admin";
export type AuthProvider = "email" | "google";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  password?: string;
  picture?: string;
  role: UserRole;
  provider: AuthProvider;
  googleId?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

export interface IOrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface IOrder {
  _id?: string;
  userId: string;
  orderId: string;
  items: IOrderItem[];
  address: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pinCode: string;
    phone: string;
  };
  payment: {
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    amount: number;
    currency: string;
    status: "pending" | "completed" | "failed";
  };
  orderStatus: "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping: number;
  tax?: number;
  total: number;
  cancelReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  stock: { [size: string]: number };
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}
