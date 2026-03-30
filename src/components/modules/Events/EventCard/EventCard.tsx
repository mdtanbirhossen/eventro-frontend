"use client";

import { IPublicEvent } from "@/types/publicEvents.types";
import { EventFeeType, EventVisibility } from "@/types/enums";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  Globe,
  Lock,
  Banknote,
  Tag,
  Star,
} from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  event: IPublicEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="group rounded-xl border bg-card overflow-hidden flex flex-col hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Banner */}
      <div className="relative h-44 bg-muted shrink-0 overflow-hidden">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/60">
            <Tag className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Featured badge */}
        {event.isFeatured && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            <Star className="h-3 w-3 fill-white" /> Featured
          </span>
        )}

        {/* Fee badge */}
        <span className="absolute top-2 right-2">
          {event.feeType === EventFeeType.FREE ? (
            <Badge className="bg-emerald-500/90 text-white border-0 text-[10px]">
              Free
            </Badge>
          ) : (
            <Badge className="bg-black/70 text-white border-0 text-[10px] gap-1">
              <Banknote className="h-3 w-3" />
              {event.currency}{" "}
              {parseFloat(event.registrationFee).toLocaleString()}
            </Badge>
          )}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category */}
        {event.category && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {event.category.name}
          </span>
        )}

        {/* Title */}
        <p className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </p>

        {/* Meta */}
        <div className="space-y-1.5 text-xs text-muted-foreground mt-auto">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · {event.time}
          </span>

          {(event.venue || event.eventLink) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {event.venue ?? "Online"}
              </span>
            </span>
          )}

          {event.maxCapacity && (
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0" />
              {event._count?.participants ?? 0} / {event.maxCapacity} joined
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t mt-1">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            {event.visibility === EventVisibility.PUBLIC ? (
              <><Globe className="h-3 w-3" /> Public</>
            ) : (
              <><Lock className="h-3 w-3" /> Private</>
            )}
          </span>
          <span className="text-[11px] text-muted-foreground truncate max-w-30">
            by {event.owner.name}
          </span>
        </div>
      </div>
    </Link>
  );
}