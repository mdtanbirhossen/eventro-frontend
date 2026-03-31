"use client";

import { useParams } from "next/navigation";
import { useEventById, useUpdateEvent } from "@/hooks/eventForm.hooks";
import {
  ICreateEventPayload,
  IUpdateEventPayload,
} from "@/types/eventForm.types";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCog } from "lucide-react";
import EventForm from "@/components/modules/Events/EventForm";

// ─── Loading skeleton ─────────────────────────────────────────

function FormSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border bg-card p-6 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function EditEventPage() {
  const params = useParams();
  const eventId = params?.eventId as string;

  const { data: event, isLoading, isError } = useEventById(eventId);
  const updateMutation = useUpdateEvent(eventId);

  const handleSubmit = async (
    payload: ICreateEventPayload | IUpdateEventPayload
  ) => {
    await updateMutation.mutateAsync(payload as IUpdateEventPayload);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarCog className="h-6 w-6 text-muted-foreground" />
          Edit Event
        </h1>
        {event && (
          <p className="text-sm text-muted-foreground mt-1 truncate">
            Editing: <span className="font-medium text-foreground">{event.title}</span>
          </p>
        )}
      </div>

      {isLoading ? (
        <FormSkeleton />
      ) : isError || !event ? (
        <div className="rounded-xl border bg-card py-16 text-center text-muted-foreground">
          Failed to load event. Please go back and try again.
        </div>
      ) : (
        // ✅ key={event.id} forces full remount if navigating
        // between different edit pages — same fix as CategoryForm
        <EventForm
          key={event.id}
          initialData={event}
          isEdit
          onSubmit={handleSubmit}
          isPending={updateMutation.isPending}
        />
      )}
    </div>
  );
}