import {
  EventStatus,
  EventVisibility,
  EventFeeType,
} from "@/types/enums";

// ─── Create Event Payload ────────────────────────────────────

/** POST /events */
export interface ICreateEventPayload {
  title: string;
  description: string;
  date: string;           // "YYYY-MM-DD"
  time: string;           // "HH:MM"
  endDate?: string | null;
  venue?: string | null;
  eventLink?: string | null;
  banner?: string | null;
  visibility: EventVisibility;
  feeType: EventFeeType;
  registrationFee?: number;
  currency?: string;
  maxCapacity?: number | null;
  categoryId?: string | null;
}

// ─── Update Event Payload ────────────────────────────────────

/** PUT /events/:eventId */
export interface IUpdateEventPayload {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  endDate?: string | null;
  venue?: string | null;
  eventLink?: string | null;
  banner?: string | null;
  visibility?: EventVisibility;
  feeType?: EventFeeType;
  registrationFee?: number;
  currency?: string;
  status?: EventStatus;
  maxCapacity?: number | null;
  categoryId?: string | null;
}

// ─── Form values (used by TanStack Form + Zod) ───────────────

/**
 * Internal form state — mirrors ICreateEventPayload but uses
 * strings for numeric fields so HTML inputs work cleanly.
 */
export interface IEventFormValues {
  title: string;
  description: string;
  date: string;
  time: string;
  endDate: string;
  venue: string;
  eventLink: string;
  banner: string;
  visibility: EventVisibility;
  feeType: EventFeeType;
  registrationFee: string;   // string → parse to number on submit
  currency: string;
  maxCapacity: string;       // string → parse to number | null on submit
  categoryId: string;        // "" means null
  status?: EventStatus;      // only used on edit form
}

// ─── Default form values ─────────────────────────────────────

export const defaultEventFormValues: IEventFormValues = {
  title: "",
  description: "",
  date: "",
  time: "",
  endDate: "",
  venue: "",
  eventLink: "",
  banner: "",
  visibility: EventVisibility.PUBLIC,
  feeType: EventFeeType.FREE,
  registrationFee: "0",
  currency: "BDT",
  maxCapacity: "",
  categoryId: "",
};

// ─── Helpers to convert form ↔ payload ──────────────────────

/** Convert IEventFormValues → ICreateEventPayload */
export function formValuesToCreatePayload(
  values: IEventFormValues
): ICreateEventPayload {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    date: values.date,
    time: values.time,
    endDate: values.endDate || null,
    venue: values.venue.trim() || null,
    eventLink: values.eventLink.trim() || null,
    banner: values.banner.trim() || null,
    visibility: values.visibility,
    feeType: values.feeType,
    registrationFee:
      values.feeType === EventFeeType.PAID
        ? parseFloat(values.registrationFee) || 0
        : 0,
    currency: values.currency || "BDT",
    maxCapacity: values.maxCapacity
      ? parseInt(values.maxCapacity, 10)
      : null,
    categoryId: values.categoryId || null,
  };
}

/** Convert IEventFormValues → IUpdateEventPayload */
export function formValuesToUpdatePayload(
  values: IEventFormValues
): IUpdateEventPayload {
  return {
    ...formValuesToCreatePayload(values),
    status: values.status,
  };
}
