import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import connectDB from "./mongodb"
import User, { type IUser } from "./models/User"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

// Create JWT token
export async function createJWT(user: IUser): Promise<string> {
  return await new SignJWT({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch (error) {
    throw new Error("Invalid token")
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

// Get user by ID
export async function getUserById(id: string): Promise<IUser | null> {
  try {
    await connectDB()
    const user = await User.findById(id)
    return user
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<IUser | null> {
  try {
    await connectDB()
    const user = await User.findOne({ email: email.toLowerCase() })
    return user
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

// Create user
export async function createUser(userData: {
  email: string
  name: string
  password?: string
  picture?: string
  role?: "user" | "admin"
  provider: "email" | "google"
  googleId?: string
}): Promise<IUser> {
  try {
    await connectDB()

    const user = new User({
      ...userData,
      email: userData.email.toLowerCase(),
      isEmailVerified: userData.provider === "google",
      lastLoginAt: new Date(),
    })

    await user.save()
    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

// Update user last login
export async function updateUserLastLogin(userId: string): Promise<void> {
  try {
    await connectDB()
    await User.findByIdAndUpdate(userId, { lastLoginAt: new Date() })
  } catch (error) {
    console.error("Error updating last login:", error)
  }
}

// Authenticate user with email/password
export async function authenticateUser(email: string, password: string): Promise<IUser | null> {
  try {
    await connectDB()
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user || user.provider !== "email" || !user.password) {
      return null
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return null
    }

    // Update last login
    user.lastLoginAt = new Date()
    await user.save()

    return user
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<IUser | null> {
  try {
    const payload = await verifyJWT(token)
    const user = await getUserById(payload.userId)
    return user
  } catch (error) {
    return null
  }
}

// Initialize default admin user
export async function initializeDefaultAdmin(): Promise<void> {
  try {
    await connectDB()

    const adminExists = await User.findOne({ email: "admin@stylesage.com" })
    if (!adminExists) {
      const hashedPassword = await hashPassword("admin123")

      await User.create({
        email: "admin@stylesage.com",
        name: "Admin User",
        password: hashedPassword,
        role: "admin",
        provider: "email",
        isEmailVerified: true,
      })

      console.log("✅ Default admin user created")
    }
  } catch (error) {
    console.error("Error initializing admin:", error)
    throw error
  }
}
