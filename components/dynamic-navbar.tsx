"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCategories,
  getNavbarConfig,
  type Category,
  type NavbarConfig,
} from "@/lib/catalog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface DynamicNavbarProps {
  currentPath?: string;
}

export function DynamicNavbar({ currentPath = "" }: DynamicNavbarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [navbarConfig, setNavbarConfig] = useState<NavbarConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadNavbarData = () => {
      try {
        const categoriesData = getCategories();
        const configData = getNavbarConfig();

        setCategories(categoriesData);
        setNavbarConfig(configData);
      } catch (error) {
        console.error("Failed to load navbar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNavbarData();

    // Listen for storage changes to update navbar in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "stylesage_categories" ||
        e.key === "stylesage_navbar" ||
        e.key === "yugantar_categories" ||
        e.key === "yugantar_navbar"
      ) {
        loadNavbarData();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, []);

  if (!mounted || isLoading) {
    return (
      <>
        <nav className="hidden md:flex space-x-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-4 w-16 bg-gray-200  rounded animate-pulse"
            />
          ))}
        </nav>
        <div className="md:hidden">
          <div className="h-8 w-8 bg-gray-200  rounded animate-pulse" />
        </div>
      </>
    );
  }

  if (!navbarConfig) return null;

  // Get active categories in order
  // Always include 'collections' category, even if not active or missing
  let activeCategories = categories
    .filter(
      (cat) =>
        navbarConfig.categories.includes(cat.id) &&
        cat.id !== "custom" &&
        cat.slug !== "custom"
    )
    .sort((a, b) => a.order - b.order);

  // If 'collections' is missing, add it from defaults
  if (!activeCategories.find((cat) => cat.id === "collections")) {
    activeCategories = [
      {
        id: "collections",
        name: "Collections",
        slug: "collections",
        description: "Our curated collections",
        isActive: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ...activeCategories,
    ];
  }

  const activeLinks = navbarConfig.customLinks.filter(
    (link) => link.isActive && !/^\/custom(\/|$)/.test(link.href)
  );

  const navLinks = [
    ...activeCategories.map((cat) => ({
      href: `/${cat.slug}`,
      label: cat.name,
    })),
    ...activeLinks.map((link) => ({ href: link.href, label: link.name })),
  ];

  return (
    <>
      <nav className="hidden md:flex space-x-8">
        {activeCategories.map((category) => (
          <Link
            key={category.id}
            href={`/${category.slug}`}
            className={`transition-colors ${
              currentPath === `/${category.slug}`
                ? "text-gray-900  font-medium border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {category.name}
          </Link>
        ))}

        {activeLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors ${
              currentPath === link.href
                ? "text-gray-900  font-medium border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-y-6 pt-6">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                
                <span className="text-xl font-bold">Yugantar</span>
              </Link>
              <nav className="flex flex-col gap-y-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-lg ${
                        currentPath === link.href
                          ? "text-primary  font-medium"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
