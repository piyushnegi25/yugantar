import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import {
  Calendar,
  Heart,
  MapPin,
  Target,
  Users,
  Zap,
} from "lucide-react";
import {
  absoluteUrl,
  createMetadata,
  generateBreadcrumbStructuredData,
} from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About Yugantar - Premium T-Shirt Brand in India",
  description:
    "Learn about Yugantar, an India-first premium t-shirt brand for anime, meme, streetwear and custom graphic tees with inclusive sizing.",
  path: "/about",
  keywords: [
    "about Yugantar",
    "custom t-shirt company",
    "t-shirt brand India",
    "premium t-shirt startup",
    "premium apparel brand",
    "anime clothing brand",
    "meme t-shirt company",
    "personalized clothing India",
    "quality t-shirts",
    "inclusive fashion",
  ],
});

const values = [
  {
    icon: <Heart className="h-8 w-8 text-red-500" />,
    title: "Inclusive Fashion",
    description:
      "We believe everyone deserves premium quality, from XS to 3XL with the same attention to detail.",
  },
  {
    icon: <Zap className="h-8 w-8 text-yellow-500" />,
    title: "Creative Expression",
    description:
      "Turning internet culture, memes, and anime into wearable art that speaks your language.",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-500" />,
    title: "Gen Z Spirit",
    description:
      "Built by Gen Z, for Gen Z. We understand the culture because we live it every day.",
  },
  {
    icon: <Target className="h-8 w-8 text-green-500" />,
    title: "Quality First",
    description:
      "Premium materials and careful design choices because comfort matters as much as expression.",
  },
];

const teamMembers = [
  {
    name: "Piyush Negi",
    role: "Founder and CEO",
    image: "/piyush.jpeg",
    description:
      "Visionary builder focused on creativity, culture, and making premium fashion feel more personal.",
  },
];

export default function AboutPage() {
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Yugantar",
    description:
      "Learn about Yugantar's mission to create premium custom t-shirts celebrating individual expression through anime, meme, and personalized designs.",
    url: absoluteUrl("/about"),
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
      ]).itemListElement,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Yugantar",
      url: absoluteUrl(),
    },
    mainEntity: {
      "@type": "Organization",
      name: "Yugantar",
      foundingDate: "2024",
      founders: [
        {
          "@type": "Person",
          name: "Piyush Negi",
          jobTitle: "Founder and CEO",
        },
      ],
      slogan: "Till End of the Era",
      mission:
        "To create premium custom t-shirts that celebrate individual expression through anime, meme, and personalized designs with inclusive sizing and quality materials.",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutStructuredData),
        }}
      />

      <div className="min-h-screen bg-white transition-colors">
        <SiteHeader currentPath="/about" />

        <section className="bg-primary py-20 text-white">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <Badge
              variant="secondary"
              className="mb-4 bg-white text-primary"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Noida, India
            </Badge>
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              About Yugantar
            </h1>
            <p className="mx-auto max-w-3xl text-xl">
              We&apos;re a Gen Z startup from Noida, putting our creativity on
              t-shirts and making premium fashion accessible to everyone,
              regardless of size.
            </p>
          </div>
        </section>

        <section className="bg-gray-50 py-20 transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className="border-primary text-primary"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Founded 2025
                  </Badge>
                  <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
                    Born from Creativity,
                    <span className="block text-primary">
                      Built for Everyone
                    </span>
                  </h2>
                </div>

                <div className="space-y-4 text-lg leading-relaxed text-gray-600">
                  <p>
                    Yugantar started with a simple idea: awesome designs should
                    never be limited by size. As Gen Z creators, we saw the gap
                    between internet culture and fashion, and wanted to build
                    something more expressive and more inclusive.
                  </p>
                  <p>
                    We&apos;re not just another t-shirt company. We&apos;re
                    storytellers, meme enthusiasts, anime lovers, and believers
                    in making fashion feel personal. Every design is meant to
                    carry a point of view, not just fill space on fabric.
                  </p>
                  <p>
                    From XS to 3XL, from classic memes to custom anime-inspired
                    drops, we aim to keep the same quality, attention, and
                    attitude across everything we make.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden rounded-none bg-secondary">
                  <Image
                    src="/aboutCustomer.png"
                    alt="Yugantar team"
                    width={480}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 border bg-white p-6 shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      10,000+
                    </div>
                    <div className="text-sm text-gray-600">
                      Happy Customers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                What We Stand For
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Our values drive everything we do, from design to delivery.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card
                  key={value.title}
                  className="border-gray-200 bg-white text-center shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">{value.icon}</div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                Meet the Team
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                The people behind Yugantar, building expressive fashion with a
                strong focus on quality and inclusivity.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-16">
              {teamMembers.map((member) => (
                <Card
                  key={member.name}
                  className="w-[27rem] border-gray-200 bg-white text-center shadow-sm"
                >
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full bg-gray-100">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={192}
                        height={192}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="mb-1 text-xl font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="mb-3 font-medium text-primary">
                      {member.role}
                    </p>
                    <p className="text-gray-600">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-20 transition-colors">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 lg:text-4xl">
                Our Plus Size Promise
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                We&apos;re not just inclusive in name. Our plus size range gets
                the same design attention, quality materials, and style focus as
                every other fit we offer, because great fashion should never be
                an afterthought.
              </p>

              <div className="mb-8 grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">
                    XS - 3XL
                  </div>
                  <p className="text-gray-600">Complete size range</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">
                    Same Quality
                  </div>
                  <p className="text-gray-600">No compromises</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">
                    Equal Love
                  </div>
                  <p className="text-gray-600">Every size matters</p>
                </div>
              </div>

              <Link href="/">
                <Button
                  size="lg"
                  className="rounded-none bg-primary uppercase font-bold tracking-wider text-white hover:bg-primary/90"
                >
                  Shop All Sizes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 py-20 text-white transition-colors">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
              Ready to Express Yourself?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
              Join customers who&apos;ve found their fit and style with
              Yugantar.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/collections">
                <Button
                  size="lg"
                  className="rounded-none bg-white text-gray-900 hover:bg-gray-100"
                >
                  Shop Collections
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
