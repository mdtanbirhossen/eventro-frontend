"use client";

import Link from "next/link";
import { ChevronRight, Tag } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { usePublicCategories } from "@/hooks/publicEvent.hooks";
import { IPublicCategory } from "@/types/publicEvents.types";
import { cn } from "@/lib/utils";

const categoryColors = [
  "bg-violet-100 text-violet-800 hover:bg-violet-200",
  "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  "bg-amber-100 text-amber-800 hover:bg-amber-200",
  "bg-rose-100 text-rose-800 hover:bg-rose-200",
  "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  "bg-orange-100 text-orange-800 hover:bg-orange-200",
  "bg-pink-100 text-pink-800 hover:bg-pink-200",
];

export default function CategoriesSection({ className }: { className?: string }) {
  const { data: categories, isLoading } = usePublicCategories();
  const list = (categories ?? []) as IPublicCategory[];

  if (!isLoading && list.length === 0) return null;

  return (
    <section className={`space-y-5 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Browse by Category
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Find events that match your interests.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full" />
          ))
          : list.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/events?categoryId=${cat.id}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border border-transparent transition-colors",
                categoryColors[i % categoryColors.length]
              )}
            >
              <Tag className="h-3.5 w-3.5" />
              {cat.name}
            </Link>
          ))}

        <Link
          href="/events"
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
        >
          View All <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}