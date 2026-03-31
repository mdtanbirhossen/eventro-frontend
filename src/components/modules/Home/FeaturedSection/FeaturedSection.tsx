"use client";
 
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedPublicEvent } from "@/hooks/publicEvent.hooks";
import { IPublicEvent } from "@/types/publicEvents.types";
import {
  CalendarDays,
  MapPin,
  Star,
  ArrowRight,
  Banknote,
} from "lucide-react";
import Link from "next/link";
 

export default function FeaturedSection() {

  const { data, isLoading, isError } = useFeaturedPublicEvent();
 
  if (isLoading) {
    return (
      <section className="w-full">
        <Skeleton className="h-120 w-full rounded-2xl" />
      </section>
    );
  }
 
  if (isError || !data) return null;
 
  const event = (data as { event?: IPublicEvent })?.event ?? (data as unknown as IPublicEvent);
 
  return (
    <section className="w-full">
      <div className="relative rounded-2xl overflow-hidden border group">
        {/* Banner */}
        <div className="relative h-105 bg-muted overflow-hidden">
          {event.banner ? (
            <img
              src={event.banner}
              alt={event.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-primary/30 via-primary/10 to-muted" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
 
          {/* Featured pill */}
          <div className="absolute top-5 left-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              <Star className="h-3.5 w-3.5 fill-white" />
              Featured Event
            </span>
          </div>
 
          {/* Content on banner */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            {event.category && (
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">
                {event.category.name}
              </p>
            )}
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-2xl mb-3">
              {event.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-white/80 mb-6">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                · {event.time}
              </span>
              {(event.venue || event.eventLink) && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {event.venue ?? "Online"}
                </span>
              )}
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Banknote className="h-4 w-4" />
                {event.feeType === "FREE"
                  ? "Free"
                  : `${event.currency} ${parseFloat(event.registrationFee).toLocaleString()}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href={`/events/${event.slug}`}>
                  View Event <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <span className="text-xs text-white/60">by {event.owner.name}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}