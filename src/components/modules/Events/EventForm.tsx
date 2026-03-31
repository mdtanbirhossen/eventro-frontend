"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRef, useState } from "react";
import {
  useEventCategories,
  useUploadBanner,
  useDeleteBanner,
} from "@/hooks/eventForm.hooks";
import {
  IEventFormValues,
  ICreateEventPayload,
  IUpdateEventPayload,
  defaultEventFormValues,
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
} from "@/types/eventForm.types";
import { IMyEvent } from "@/types/userDashboard.type";
import { EventVisibility, EventFeeType, EventStatus } from "@/types/enums";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ImagePlus,
  X,
  Loader2,
  CalendarDays,
  Clock,
  MapPin,
  Link2,
  Users,
  Tag,
  Globe,
  Lock,
  Banknote,
} from "lucide-react";

// ─── Zod schema ──────────────────────────────────────────────

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
  endDate: z.string().optional(),
  venue: z.string().optional(),
  eventLink: z.string().url("Enter a valid URL.").optional().or(z.literal("")),
  banner: z.string().optional(),
  visibility: z.nativeEnum(EventVisibility),
  feeType: z.nativeEnum(EventFeeType),
  registrationFee: z.string().optional(),
  currency: z.string().optional(),
  maxCapacity: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.nativeEnum(EventStatus).optional(),
});

// ─── Field Error ─────────────────────────────────────────────

function FieldError({ errors }: { errors: unknown[] }) {
  if (!errors.length) return null;
  return (
    <p className="text-xs text-destructive mt-1">{String(errors[0])}</p>
  );
}

// ─── Section wrapper ─────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Banner Upload ───────────────────────────────────────────

function BannerUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const uploadMutation = useUploadBanner();
  const deleteMutation = useDeleteBanner();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // delete old banner first
    if (value) await deleteMutation.mutateAsync([value]);
    const url = await uploadMutation.mutateAsync(file);
    onChange(url);
    // reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = async () => {
    if (value) await deleteMutation.mutateAsync([value]);
    onChange("");
  };

  const isLoading = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-2">
      <Label>Banner Image</Label>
      {value ? (
        <div className="relative h-48 rounded-lg overflow-hidden border bg-muted">
          <img
            src={value}
            alt="Event banner"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={isLoading}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-muted/40 text-muted-foreground hover:border-foreground/30 hover:bg-muted/60 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">Click to upload banner</span>
              <span className="text-xs">PNG, JPG, WEBP up to 10MB</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────

interface EventFormProps {
  /** Pass existing event to pre-fill edit form */
  initialData?: IMyEvent;
  isEdit?: boolean;
  onSubmit: (
    payload: ICreateEventPayload | IUpdateEventPayload
  ) => Promise<void>;
  isPending: boolean;
}

// ─── Main Form ───────────────────────────────────────────────

export default function EventForm({
  initialData,
  isEdit = false,
  onSubmit,
  isPending,
}: EventFormProps) {
  const { data: categories, isLoading: categoriesLoading } =
    useEventCategories();
  // console.log("EventForm categories:", categories, "loading:", categoriesLoading);

  // ── Build default values from initialData if editing ──
  const defaultValues: IEventFormValues = initialData
    ? {
      title: initialData.title,
      description: initialData.description,
      date: initialData.date.split("T")[0], // "YYYY-MM-DD"
      time: initialData.time,
      endDate: initialData.endDate?.split("T")[0] ?? "",
      venue: initialData.venue ?? "",
      eventLink: initialData.eventLink ?? "",
      banner: initialData.banner ?? "",
      visibility: initialData.visibility,
      feeType: initialData.feeType,
      registrationFee: initialData.registrationFee,
      currency: initialData.currency,
      maxCapacity: initialData.maxCapacity?.toString() ?? "",
      categoryId: initialData.categoryId ?? "",
      status: initialData.status,
    }
    : defaultEventFormValues;

  const form = useForm
    //   <IEventFormValues>
    ({
      defaultValues,
      onSubmit: async ({ value }) => {
        const result = eventSchema.safeParse(value);
        if (!result.success) return;
        const payload = isEdit
          ? formValuesToUpdatePayload(value)
          : formValuesToCreatePayload(value);
        await onSubmit(payload);
      },
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* ── Basic Info ── */}
      <Section title="Basic Information">
        {/* Title */}
        <form.Field name="title">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Tech Meetup Dhaka 2025"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Tell attendees what your event is about…"
                rows={5}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldError errors={field.state.meta.errors} />
            </div>
          )}
        </form.Field>

        {/* Category */}
        <form.Field name="categoryId">
          {(field) => (
            <div className="space-y-1.5">
              <Label>
                <Tag className="inline h-3.5 w-3.5 mr-1" />
                Category
              </Label>
              {categoriesLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={field.state.value || "none"}
                  onValueChange={(v) => field.handleChange(v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category (optional)" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>

                    {(categories ?? []).map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </form.Field>
      </Section>

      {/* ── Date & Time ── */}
      <Section title="Date & Time">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Date */}
          <form.Field name="date">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="date">
                  <CalendarDays className="inline h-3.5 w-3.5 mr-1" />
                  Start Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          {/* Time */}
          <form.Field name="time">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="time">
                  <Clock className="inline h-3.5 w-3.5 mr-1" />
                  Start Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldError errors={field.state.meta.errors} />
              </div>
            )}
          </form.Field>

          {/* End Date */}
          <form.Field name="endDate">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
            )}
          </form.Field>
        </div>
      </Section>

      {/* ── Location ── */}
      <Section title="Location">
        {/* Venue */}
        <form.Field name="venue">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="venue">
                <MapPin className="inline h-3.5 w-3.5 mr-1" />
                Venue
              </Label>
              <Input
                id="venue"
                placeholder="e.g. BASIS Auditorium, Dhaka"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            </div>
          )}
        </form.Field>

        {/* Event Link */}
        <form.Field name="eventLink">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="eventLink">
                <Link2 className="inline h-3.5 w-3.5 mr-1" />
                Online Event Link
              </Label>
              <Input
                id="eventLink"
                type="url"
                placeholder="https://meet.google.com/…"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <FieldError errors={field.state.meta.errors} />
              <p className="text-xs text-muted-foreground">
                Leave blank for in-person events.
              </p>
            </div>
          )}
        </form.Field>
      </Section>

      {/* ── Visibility & Fee ── */}
      <Section title="Visibility & Registration">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Visibility */}
          <form.Field name="visibility">
            {(field) => (
              <div className="space-y-1.5">
                <Label>
                  Visibility <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as EventVisibility)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventVisibility.PUBLIC}>
                      <span className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Public
                      </span>
                    </SelectItem>
                    <SelectItem value={EventVisibility.PRIVATE}>
                      <span className="flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Private
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Fee Type */}
          <form.Field name="feeType">
            {(field) => (
              <div className="space-y-1.5">
                <Label>
                  Fee Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as EventFeeType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventFeeType.FREE}>Free</SelectItem>
                    <SelectItem value={EventFeeType.PAID}>Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>
        </div>

        {/* Registration Fee — only show when PAID */}
        <form.Subscribe selector={(s) => s.values.feeType}>
          {(feeType) =>
            feeType === EventFeeType.PAID ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form.Field name="registrationFee">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="fee">
                        <Banknote className="inline h-3.5 w-3.5 mr-1" />
                        Registration Fee <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fee"
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="500"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                </form.Field>

                <form.Field name="currency">
                  {(field) => (
                    <div className="space-y-1.5">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BDT">BDT</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
              </div>
            ) : null
          }
        </form.Subscribe>

        {/* Max Capacity */}
        <form.Field name="maxCapacity">
          {(field) => (
            <div className="space-y-1.5">
              <Label htmlFor="maxCapacity">
                <Users className="inline h-3.5 w-3.5 mr-1" />
                Max Capacity
              </Label>
              <Input
                id="maxCapacity"
                type="number"
                min={1}
                placeholder="Leave blank for unlimited"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to allow unlimited attendees.
              </p>
            </div>
          )}
        </form.Field>
      </Section>

      {/* ── Status (edit only) ── */}
      {isEdit && (
        <Section title="Event Status">
          <form.Field name="status">
            {(field) => (
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as EventStatus)
                  }
                >
                  <SelectTrigger className="w-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={EventStatus.PUBLISHED}>
                      Published
                    </SelectItem>
                    <SelectItem value={EventStatus.CANCELLED}>
                      Cancelled
                    </SelectItem>
                    <SelectItem value={EventStatus.COMPLETED}>
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Set to Published to make the event visible to everyone.
                </p>
              </div>
            )}
          </form.Field>
        </Section>
      )}

      {/* ── Banner ── */}
      <Section title="Banner Image">
        <form.Field name="banner">
          {(field) => (
            <BannerUpload
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
      </Section>

      {/* ── Submit ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-35">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Event"
          )}
        </Button>
      </div>
    </form>
  );
}