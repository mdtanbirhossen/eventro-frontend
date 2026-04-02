
"use client";


import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicEvents } from "@/hooks/publicEvent.hooks";
import { IPublicEvent } from "@/types/publicEvents.types";
import {
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import EventCard from "../../Events/EventCard/EventCard";
import { EventStatus, EventVisibility } from "@/types/enums";

function EventCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Skeleton className="h-44 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export default function LatestEventsSection() {
  const { data, isLoading, isError } = usePublicEvents({
    page: 1,
    limit: 8,
    status: EventStatus.PUBLISHED,
    visibility: EventVisibility.PUBLIC,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const events = (data?.data ?? []) as IPublicEvent[];

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Latest Events</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Freshly added events you don't want to miss.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="gap-2 hidden sm:flex">
          <Link href="/events">
            See All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {isError ? (
        <div className="rounded-xl border bg-card py-12 text-center text-sm text-muted-foreground">
          Failed to load events.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
            : events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </div>
      )}

      {/* Mobile see all */}
      <div className="flex sm:hidden justify-center pt-2">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/events">
            See All Events <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}