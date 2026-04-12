import { Metadata } from "next";

// Base SEO configuration
export const siteConfig = {
  name: "Yugantar",
  description:
    "Buy premium t-shirts online in India with anime, meme, streetwear, and custom designs. Fast shipping, quality fabric, and inclusive sizing.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://www.stylesage.me",
  siteName: "Yugantar - Premium T-Shirts India",
  creator: "@StyleSageOfficial",
  authors: [
    {
      name: "Manas Bhaintwal",
      url: "https://github.com/ManasBhaintwal",
    },
  ],
  keywords: [
    "buy t-shirts online India",
    "best t-shirt website India",
    "t-shirt shopping online",
    "graphic t-shirts India",
    "oversized t-shirts India",
    "custom t-shirts India",
    "anime t-shirts online",
    "meme t-shirts designs",
    "personalized clothing India",
    "premium t-shirts India",
    "custom apparel India",
    "graphic tees online",
    "organic cotton t-shirts",
    "plus size t-shirts India",
    "streetwear India",
    "otaku clothing",
    "internet culture fashion",
    "unique t-shirt designs",
    "quality t-shirts India",
    "fast shipping t-shirts",
    "affordable custom tees",
    "trendy t-shirts India",
    "geek culture clothing",
    "pop culture t-shirts",
    "creative t-shirt prints",
    "streetwear t-shirts India",
    "myntra alternatives t-shirts",
    "ajio alternatives t-shirts",
    "snitch alternatives t-shirts",
    "bewakoof alternatives",
    "wrogn alternatives",
    "bearhouse alternatives",
    "soulstore alternatives",
  ],
  category: "E-commerce",
  phone: "+91-1234567890",
  email: "support@stylesage.com",
  address: {
    street: "Sector 62",
    city: "Noida",
    state: "Uttar Pradesh",
    zipCode: "201309",
    country: "India",
  },
  social: {
    instagram: "https://www.instagram.com/stylesage",
    facebook: "https://www.facebook.com/stylesage",
    twitter: "https://twitter.com/stylesage",
    youtube: "https://www.youtube.com/@stylesage",
    pinterest: "https://pinterest.com/stylesage",
  },
  businessHours: "Mon-Sun 9:00 AM - 9:00 PM IST",
  priceRange: "₹₹",
  paymentMethods: [
    "Cash on Delivery",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Net Banking",
    "Wallets",
  ],
};

export const domainMigrationConfig = {
  oldDomain: process.env.NEXT_PUBLIC_APP_URL || "https://www.stylesage.me",
  newDomain: process.env.NEXT_PUBLIC_FUTURE_DOMAIN || "https://www.yugantar.com",
};

export function absoluteUrl(path: string = "") {
  if (!path) {
    return siteConfig.url;
  }

  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

// Generate structured data for products
export function generateProductStructuredData(product: {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviews: number;
  category: string[];
  sizes: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category.join(", "),
    brand: {
      "@type": "Brand",
      name: "StyleSage",
    },
    manufacturer: {
      "@type": "Organization",
      name: "StyleSage",
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product._id}`),
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "StyleSage",
      },
      ...(product.originalPrice && {
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: product.originalPrice,
          priceCurrency: "INR",
        },
      }),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    additionalProperty: product.sizes.map((size) => ({
      "@type": "PropertyValue",
      name: "Size",
      value: size,
    })),
  };
}

// Generate website structured data
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

// Generate local business structured data
export function generateLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zipCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.6139",
      longitude: "77.2090",
    },
    openingHours: "Mo-Su 09:00-21:00",
    priceRange: siteConfig.priceRange,
    paymentAccepted: siteConfig.paymentMethods,
    currenciesAccepted: "INR",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData() {
  const faqs = [
    {
      question: "What materials do you use for your t-shirts?",
      answer:
        "We use premium quality 100% organic cotton and cotton blends that are soft, durable, and comfortable. All our materials are ethically sourced and eco-friendly.",
    },
    {
      question: "What sizes do you offer?",
      answer:
        "We offer inclusive sizing from XS to 5XL to ensure everyone can find their perfect fit. Each product page includes detailed size charts for accurate measurements.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "We offer fast shipping across India with delivery typically within 3-7 business days for metro cities and 5-10 business days for other locations. Express shipping options are also available.",
    },
    {
      question: "Can I customize my own design?",
      answer:
        "Yes! We offer custom design services where you can upload your own artwork or text. Our design team can also help create unique designs based on your requirements.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all products. Items must be in original condition with tags attached. Custom personalized items may have different return conditions.",
    },
    {
      question: "Do you offer cash on delivery?",
      answer:
        "Yes, we accept multiple payment methods including Cash on Delivery, UPI, Credit/Debit cards, Net Banking, and popular digital wallets.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Generate review aggregate structured data
export function generateReviewAggregateStructuredData(
  rating: number,
  reviewCount: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: rating,
    reviewCount: reviewCount,
    bestRating: 5,
    worstRating: 1,
    itemReviewed: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

// Generate collection page structured data
export function generateCollectionStructuredData(
  collectionName: string,
  products: Array<{
    _id: string;
    name: string;
    price: number;
    images: string[];
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${collectionName} T-Shirts Collection`,
    description: `Browse our ${collectionName.toLowerCase()} t-shirt collection featuring unique designs and premium quality materials.`,
    url: absoluteUrl(`/${collectionName.toLowerCase()}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          image: product.images[0],
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}/og-image.png`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "Customer Service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "21:00",
        },
      },
      {
        "@type": "ContactPoint",
        email: siteConfig.email,
        contactType: "Customer Support",
        areaServed: "IN",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zipCode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "28.6139",
      longitude: "77.2090",
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.twitter,
      siteConfig.social.youtube,
      siteConfig.social.pinterest,
    ],
    openingHours: "Mo-Su 09:00-21:00",
    priceRange: siteConfig.priceRange,
    paymentAccepted: siteConfig.paymentMethods,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceArea: {
      "@type": "Country",
      name: "India",
    },
    foundingDate: "2024",
    numberOfEmployees: "2-10",
    knowsAbout: [
      "Custom T-Shirts",
      "Anime Merchandise",
      "Meme Clothing",
      "Personalized Apparel",
      "Graphic Design",
      "Print on Demand",
    ],
  };
}

// Base metadata for pages
export function createMetadata({
  title,
  description,
  path = "",
  images,
  noIndex = false,
  keywords,
}: {
  title?: string;
  description?: string;
  path?: string;
  images?: string[];
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const url = absoluteUrl(path);

  const defaultImages = [absoluteUrl("/opengraph-image")];
  const pageImages = (images?.length ? images : defaultImages).map((image) =>
    image.startsWith("http") ? image : absoluteUrl(image)
  );

  return {
    title: pageTitle,
    description: pageDescription,
    applicationName: siteConfig.siteName,
    keywords: keywords?.length ? keywords : siteConfig.keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    referrer: "origin-when-cross-origin",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.siteName,
      images: pageImages.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: pageTitle,
      })),
      locale: "en_IN",
      countryName: "India",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      creator: siteConfig.creator,
      images: pageImages,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    category: siteConfig.category,
  };
}

// Product-specific metadata
export function createProductMetadata({
  product,
  path,
}: {
  product: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string[];
  };
  path: string;
}) {
  const title = `${product.name} - Premium Custom T-Shirt`;
  const description = `${
    product.description
  } Shop premium quality ${product.category.join(", ")} t-shirts starting at ₹${
    product.price
  }. Fast shipping across India.`;

  const keywords = [
    product.name.toLowerCase(),
    ...product.category.map((cat) => `${cat} t-shirt`),
    "custom t-shirt",
    "premium quality",
    "fast shipping India",
  ];

  return createMetadata({
    title,
    description,
    path,
    images: product.images.slice(0, 4),
    keywords,
  });
}

// Category-specific metadata
export function createCategoryMetadata({
  categoryName,
  description,
  path,
  productCount,
}: {
  categoryName: string;
  description: string;
  path: string;
  productCount?: number;
}) {
  const title = `${categoryName} T-Shirts Collection Online India`;
  const desc = `${description} ${
    productCount
      ? `Browse ${productCount} unique designs`
      : "Shop our premium collection"
  } with fast shipping across India.`;

  const keywords = [
    `${categoryName.toLowerCase()} t-shirts`,
    `${categoryName.toLowerCase()} clothing`,
    "custom t-shirts",
    "premium quality",
    "India delivery",
  ];

  return createMetadata({
    title,
    description: desc,
    path,
    keywords,
  });
}
