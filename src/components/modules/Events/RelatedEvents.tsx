"use client";

import { usePublicEvents } from "@/hooks/publicEvent.hooks";
import EventCard from "./EventCard/EventCard";
import { Sparkles, CalendarX2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedEventsProps {
  categoryId: string;
  currentEventId: string;
}

export default function RelatedEvents({ categoryId, currentEventId }: RelatedEventsProps) {
  const { data, isLoading, isError } = usePublicEvents({ categoryId, limit: 5 });
  
  const relatedEvents = data?.data?.filter((e) => e.id !== currentEventId).slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="space-y-4 pt-10 border-t mt-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recommended Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
           <Skeleton className="h-[22rem] w-full rounded-xl" />
           <Skeleton className="h-[22rem] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || relatedEvents.length === 0) {
    return (
      <div className="space-y-4 pt-10 border-t mt-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recommended Events
        </h2>
        <div className="flex flex-col items-center justify-center p-8 border rounded-xl bg-card/50 text-muted-foreground">
          <CalendarX2 className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm">No related events found at this moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-10 border-t mt-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommended Events
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your interest in this event, our smart engine suggests these similar experiences.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {relatedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
