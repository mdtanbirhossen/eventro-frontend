"use client";

import EventForm from "@/components/modules/Events/EventForm";
import { useCreateEvent } from "@/hooks/eventForm.hooks";
import {
  ICreateEventPayload,
  IUpdateEventPayload,
} from "@/types/eventForm.types";
import { CalendarPlus } from "lucide-react";

export default function CreateEventPage() {
  const createMutation = useCreateEvent();

  const handleSubmit = async (
    payload: ICreateEventPayload | IUpdateEventPayload
  ) => {
    await createMutation.mutateAsync(payload as ICreateEventPayload);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarPlus className="h-6 w-6 text-muted-foreground" />
          Create Event
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to publish your event.
        </p>
      </div>

      <EventForm
        onSubmit={handleSubmit}
        isPending={createMutation.isPending}
      />
    </div>
  );
}