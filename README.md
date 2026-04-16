# Yugantar - T-Shirt E-commerce Platform

A modern, full-stack e-commerce platform for custom t-shirts built with Next.js, TypeScript, and MongoDB.

## Features

### 🛍️ E-commerce Core

- **Dynamic Product Catalog**: Browse products by categories (Anime, Meme, Custom designs)
- **Smart Shopping Cart**: Persistent cart with local storage and user session integration
- **Secure Checkout**: Complete order processing with address management
- **Order Management**: Track and manage customer orders

### 👤 User Authentication

- **Multi-auth Support**: Email/password and Google OAuth integration
- **Role-based Access**: User and admin role management
- **Secure Sessions**: JWT-based authentication with HTTP-only cookies

### 🎨 Dynamic Content Management

- **Admin Dashboard**: Manage products, categories, and orders
- **Image Upload**: Cloudinary integration for product images
- **Real-time Updates**: Dynamic product loading and filtering

### 🎯 User Experience

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark/Light Mode**: Theme toggle support
- **Loading States**: Smooth loading experiences throughout the app
- **Error Handling**: Comprehensive error boundaries and user feedback

## Tech Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Form handling with validation

### Backend

- **Next.js API Routes**: Server-side API endpoints
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

### Services

- **Cloudinary**: Image upload and management
- **Google OAuth**: Third-party authentication

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   └── ...                # Other pages
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── ui/                # Base UI components
│   └── ...                # Feature components
├── lib/                   # Utility libraries
│   ├── models/            # MongoDB models
│   ├── auth.ts            # Authentication utilities
│   ├── mongodb.ts         # Database connection
│   └── ...                # Other utilities
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── styles/                # Global styles
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_APP_URL=https://yugantar.studio

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google

# Cloudinary
CLOUDINARY_URL=your_cloudinary_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Resend (email notifications)
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
ORDER_ADMIN_EMAIL=piyushnegi.bca2022@imsuc.ac.in
```

Replace `re_xxxxxxxxx` with your real Resend API key.

## Getting Started

1. **Clone the repository**

   ```bash
git clone https://github.com/Manas-bh/yugantar.git
cd yugantar
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Copy `.env.example` to `.env.local`
   - Fill in your environment variables

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Key Features Implementation

### Cart Management

- Persistent cart using localStorage
- User session integration
- Real-time cart updates
- Cart migration on login

### Product Management

- Category-based organization
- Tag-based filtering
- Image upload with Cloudinary
- Dynamic product loading

### Authentication Flow

- Email/password registration and login
- Google OAuth integration
- Protected routes with middleware
- Role-based access control

### Admin Features

- Product catalog management
- Order processing
- User management
- Analytics dashboard

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/callback/google` - Google OAuth callback

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart & Orders

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `POST /api/checkout` - Process checkout
- `GET /api/orders` - Get user orders

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Manas Bhaintwal - [GitHub](https://github.com/ManasBhaintwal)

Project Link: [https://github.com/Manas-bh/yugantar](https://github.com/Manas-bh/yugantar)
