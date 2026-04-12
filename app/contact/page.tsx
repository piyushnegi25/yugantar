import { Metadata } from "next";
import {
  absoluteUrl,
  createMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const SUPPORT_EMAIL = "support@stylesage.com";

export const metadata: Metadata = createMetadata({
  title: "Contact Yugantar - T-Shirt Support India",
  description:
    "Contact Yugantar for order support, shipping help, returns and custom t-shirt inquiries across India.",
  path: "/contact",
  keywords: [
    "contact Yugantar",
    "customer support",
    "t-shirt support India",
    "t-shirt inquiries",
    "custom order help",
    "Yugantar phone number",
    "Yugantar email",
    "customer service",
  ],
});

export default function ContactPage() {
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Yugantar",
    description:
      "Get in touch with Yugantar for customer support, custom orders, and inquiries about premium t-shirts.",
    url: absoluteUrl("/contact"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
      ]).itemListElement,
    },
    mainEntity: {
      "@type": "Organization",
      name: "Yugantar",
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-1234567890",
          contactType: "Customer Service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
          hoursAvailable: "Mo-Su 09:00-21:00",
        },
        {
          "@type": "ContactPoint",
          email: SUPPORT_EMAIL,
          contactType: "Customer Support",
          areaServed: "IN",
        },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sector 62",
        addressLocality: "Noida",
        addressRegion: "Uttar Pradesh",
        postalCode: "201309",
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactStructuredData),
        }}
      />
      <div className="min-h-screen bg-gray-50 ">
        {/* Header */}
        <div className="bg-white  border-b border-gray-200 ">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900 ">
                  Contact Us
                </h1>
              </div>
              <p className="text-gray-600  text-lg">
                We'd love to hear from you. Get in touch with our team.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <p className="text-gray-600 ">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700  mb-2"
                        >
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700  mb-2"
                        >
                          Last Name *
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700  mb-2"
                      >
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700  mb-2"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700  mb-2"
                      >
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        className="w-full px-3 py-2 border border-gray-300  rounded-md bg-white  text-gray-900 "
                      >
                        <option value="">Select a subject</option>
                        <option value="order-inquiry">Order Inquiry</option>
                        <option value="custom-design">
                          Custom Design Request
                        </option>
                        <option value="shipping">Shipping Question</option>
                        <option value="return-exchange">Return/Exchange</option>
                        <option value="product-question">
                          Product Question
                        </option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700  mb-2"
                      >
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        className="w-full"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 ">
                        Email
                      </p>
                        <a
                          href={`mailto:${SUPPORT_EMAIL}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {SUPPORT_EMAIL}
                        </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 ">
                        Phone
                      </p>
                      <a
                        href="tel:+911234567890"
                        className="text-green-600 hover:text-green-700"
                      >
                        +91 123 456 7890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 ">
                        Address
                      </p>
                      <p className="text-gray-600 ">
                        Sector 62
                        <br />
                        Noida, Uttar Pradesh 201309
                        <br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 ">
                        Business Hours
                      </p>
                      <p className="text-gray-600 ">
                        Monday - Sunday
                        <br />
                        9:00 AM - 9:00 PM IST
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <a
                      href="https://www.instagram.com/stylesage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.facebook.com/stylesage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="https://twitter.com/stylesage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-600  mt-4">
                    Stay updated with our latest designs and offers!
                  </p>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/faq"
                    className="block text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Frequently Asked Questions
                  </Link>
                  <Link
                    href="/faq"
                    className="block text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Shipping & Delivery FAQs
                  </Link>
                  <Link
                    href="/faq"
                    className="block text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Returns & Exchanges FAQs
                  </Link>
                  <Link
                    href="/collections"
                    className="block text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Shop Collections
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
