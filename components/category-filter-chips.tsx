"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterCategory {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterChipsProps {
  categories: FilterCategory[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
  className?: string;
}

const COLLAPSED_TAG_COUNT = 8;

export function CategoryFilterChips({
  categories,
  selectedCategory,
  onSelect,
  className,
}: CategoryFilterChipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldCollapse = categories.length > COLLAPSED_TAG_COUNT;
  const visibleCategories = useMemo(() => {
    if (isExpanded || !shouldCollapse) {
      return categories;
    }

    return categories.slice(0, COLLAPSED_TAG_COUNT);
  }, [categories, isExpanded, shouldCollapse]);

  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <div className="flex flex-wrap gap-2">
        {visibleCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(category.id)}
            className="h-10 whitespace-nowrap px-3 text-xs sm:text-sm"
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {shouldCollapse && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-3 h-10 px-2 text-sm text-gray-600 hover:bg-transparent hover:text-gray-900"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4" />
              Show fewer categories
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4" />
              Show all categories
            </>
          )}
        </Button>
      )}
    </div>
  );
}
