"use client";

import { useFeaturedPublicEvent } from "@/hooks/publicEvent.hooks";
import { EventFeeType } from "@/types/enums";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  MapPin,
  Star,
  ArrowRight,
  Banknote,
} from "lucide-react";
import Link from "next/link";

function FeaturedSkeleton() {
  return (
    <div className="relative rounded-2xl overflow-hidden border bg-card">
      <Skeleton className="h-72 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedEventSection({ className }: { className?: string }) {
  const { data, isLoading, isError } = useFeaturedPublicEvent();
  // console.log(data)
  if (isLoading) return <FeaturedSkeleton />;
  if (isError || !data?.data) return null;

  const event = data?.data;
  // console.log(event)
  return (
    <div className={`relative rounded-2xl overflow-hidden border bg-card group ${className}`}>
      {/* Banner */}
      <div className="relative h-72 bg-muted overflow-hidden">
        {event?.banner ? (
          <img
            src={event?.banner}
            alt={event?.title ?? "Featured Event"}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-primary/20 to-primary/5" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Featured pill */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
          <Star className="h-3.5 w-3.5 fill-white" />
          Featured Event
        </span>

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {event?.category?.name && (
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-2">
              {event?.category?.name}
            </p>
          )}

          <h2 className="text-2xl font-bold leading-tight line-clamp-2">
            {event?.title ?? "Untitled Event"}
          </h2>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event?.description ?? ""}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {event?.date
              ? new Date(event?.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })
              : "Date not available"}{" "}
            {event?.time ? `· ${event?.time}` : ""}
          </span>

          {(event?.venue || event?.eventLink) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              {event?.venue ?? "Online"}
            </span>
          )}

          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Banknote className="h-4 w-4 shrink-0" />
            {event?.feeType === EventFeeType.FREE
              ? "Free"
              : `${event?.currency ?? ""} ${event?.registrationFee
                ? parseFloat(event?.registrationFee)?.toLocaleString()
                : "0"
              }`}
          </span>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 pt-1">
          <Button asChild>
            <Link href={`/events/${event?.id ?? ""}`} className="gap-2">
              View Event
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <span className="text-xs text-muted-foreground">
            by {event?.owner?.name ?? "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
}