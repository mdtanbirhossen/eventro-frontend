"use client";

import { useState } from "react";
import { usePublicEvents, usePublicCategories } from "@/hooks/publicEvent.hooks";
import { IPublicEventsQueryParams } from "@/types/publicEvents.types";
import { EventFeeType, EventStatus, EventVisibility } from "@/types/enums";

import { Pagination } from "@/components/shared/Pagination/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import FeaturedEventSection from "./FeaturedEventSection";
import EventCard from "./EventCard/EventCard";

// ─── Card Skeleton ────────────────────────────────────────────

function EventCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Skeleton className="h-44 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

const LIMIT = 12;

export default function PublicEventsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [feeType, setFeeType] = useState<"ALL" | EventFeeType>("ALL");
  const [visibility, setVisibility] = useState<"ALL" | EventVisibility>("ALL");
  const [categoryId, setCategoryId] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<IPublicEventsQueryParams["sortBy"]>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categoriesData } = usePublicCategories();
  const categories = categoriesData ?? [];

  const params: IPublicEventsQueryParams = {
    page,
    limit: LIMIT,
    search: search || undefined,
    feeType: feeType !== "ALL" ? feeType : undefined,
    visibility: EventVisibility.PUBLIC,
    categoryId: categoryId !== "ALL" ? categoryId : undefined,
    status: EventStatus.PUBLISHED as const,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError } = usePublicEvents(params);

  const events = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const hasActiveFilter =
    search || feeType !== "ALL" || visibility !== "ALL" || categoryId !== "ALL";

  const resetFilters = () => {
    setSearch("");
    setSearchInput("");
    setFeeType("ALL");
    setVisibility("ALL");
    setCategoryId("ALL");
    setSortBy("date");
    setSortOrder("asc");
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-8 py-8 px-4 max-w-7xl mx-auto">
      {/* Featured */}
      <FeaturedEventSection />

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Browse Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover events happening around you.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilter && (
            <span className="h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setPage(1);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Filters panel */}
      {showFilters && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Category */}
            <div className="space-y-1.5 min-w-40">
              <p className="text-xs font-medium text-muted-foreground">Category</p>
              <Select
                value={categoryId}
                onValueChange={(v) => { setCategoryId(v); setPage(1); }}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fee */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Fee</p>
              <Select
                value={feeType}
                onValueChange={(v) => { setFeeType(v as "ALL" | EventFeeType); setPage(1); }}
              >
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Any Fee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Any Fee</SelectItem>
                  <SelectItem value={EventFeeType.FREE}>Free</SelectItem>
                  <SelectItem value={EventFeeType.PAID}>Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>


            {/* Sort */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Sort By</p>
              <div className="flex gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(v) => { setSortBy(v as IPublicEventsQueryParams["sortBy"]); setPage(1); }}
                >
                  <SelectTrigger className="w-37.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Event Date</SelectItem>
                    <SelectItem value="createdAt">Recently Added</SelectItem>
                    <SelectItem value="registrationFee">Price</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortOrder}
                  onValueChange={(v) => { setSortOrder(v as "asc" | "desc"); setPage(1); }}
                >
                  <SelectTrigger className="w-27.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Asc</SelectItem>
                    <SelectItem value="desc">Desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {hasActiveFilter && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5">
              <X className="h-3.5 w-3.5" />
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
      {!isLoading && !isError && (
        <p className="text-sm text-muted-foreground">
          {total} event{total !== 1 ? "s" : ""} found
          {search && <> for &quot;<span className="font-medium text-foreground">{search}</span>&quot;</>}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border bg-card py-20 text-center text-muted-foreground">
          Failed to load events. Please try again.
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-xl border bg-card py-20 text-center space-y-3">
          <Search className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground text-sm">
            {hasActiveFilter
              ? "No events match your filters."
              : "No events available right now."}
          </p>
          {hasActiveFilter && (
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && total > LIMIT && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          showing={events.length}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          itemLabel="events"
        />
      )}
    </div>
  );
}