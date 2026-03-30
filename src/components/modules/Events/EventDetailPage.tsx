"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  usePublicEventBySlug,
  useJoinPublicEvent,
  useEventReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/publicEvent.hooks";
import { useAuth } from "@/context/AuthContext";
import { IPublicReview, ICreateReviewPayload } from "@/types/publicEvents.types";
import { EventFeeType, EventVisibility, ParticipantStatus } from "@/types/enums";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CalendarDays,
  MapPin,
  Globe,
  Lock,
  Banknote,
  Users,
  Link2,
  Star,
  Pencil,
  Trash2,
  Loader2,
  UserCheck,
  Clock,
} from "lucide-react";
import Link from "next/link";

// ─── Star Rating ──────────────────────────────────────────────

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}`}
        >
          <Star
            className={`h-5 w-5 ${star <= value
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
              }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Join Button ──────────────────────────────────────────────

function JoinButton({ eventId, feeType, currency, registrationFee }: {
  eventId: string;
  feeType: EventFeeType;
  currency: string;
  registrationFee: string;
}) {
  const { user } = useAuth();
  const joinMutation = useJoinPublicEvent();

  if (!user) {
    return (
      <Button asChild size="lg" className="w-full sm:w-auto">
        <Link href="/login">Login to Join</Link>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto gap-2"
      onClick={() => joinMutation.mutate(eventId)}
      disabled={joinMutation.isPending}
    >
      {joinMutation.isPending ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> Joining…</>
      ) : feeType === EventFeeType.PAID ? (
        <><Banknote className="h-4 w-4" /> Pay & Join · {currency} {parseFloat(registrationFee).toLocaleString()}</>
      ) : (
        <><UserCheck className="h-4 w-4" /> Join Event</>
      )}
    </Button>
  );
}

// ─── Review Form ──────────────────────────────────────────────

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating.").max(5),
  comment: z.string().optional(),
});

function ReviewForm({
  eventId,
  onSuccess,
}: {
  eventId: string;
  onSuccess: () => void;
}) {
  const createReview = useCreateReview(eventId);

  const form = useForm
    //   <ICreateReviewPayload>
    ({
      defaultValues: { rating: 0, comment: "" },
      onSubmit: async ({ value }) => {
        const result = reviewSchema.safeParse(value);
        if (!result.success) return;
        const createReviewData = { ...result.data, eventId };
        console.log("Creating review with data:", createReviewData);
        const res = await createReview.mutateAsync(createReviewData );
        if (res.success) {
          form.reset();
          onSuccess();
        }
      },
    });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
      className="rounded-xl border bg-card p-5 space-y-4"
    >
      <h3 className="font-semibold text-sm">Write a Review</h3>

      {/* Rating */}
      <form.Field name="rating">
        {(field) => (
          <div className="space-y-1.5">
            <StarRating
              value={field.state.value}
              onChange={field.handleChange}
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-destructive">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Comment */}
      <form.Field name="comment">
        {(field) => (
          <Textarea
            placeholder="Share your experience (optional)…"
            rows={3}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <Button type="submit" size="sm" disabled={createReview.isPending}>
        {createReview.isPending ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}

// ─── Review Card ──────────────────────────────────────────────

function ReviewCard({
  review,
  eventId,
  currentUserId,
}: {
  review: IPublicReview;
  eventId: string;
  currentUserId?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment ?? "");

  const updateReview = useUpdateReview(eventId);
  const deleteReview = useDeleteReview(eventId);

  const isOwner = currentUserId === review.userId;

  const handleUpdate = async () => {
    const res = await updateReview.mutateAsync({
      reviewId: review.id,
      payload: { rating: editRating, comment: editComment },
    });
    if (res.success) setEditing(false);
  };

  const handleDelete = async () => {
    const res = await deleteReview.mutateAsync(review.id);
    if (res.success) setDeleteOpen(false);
  };

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={review.user.image ?? undefined} />
            <AvatarFallback className="text-xs">
              {review.user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{review.user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
              {review.isEdited && " · edited"}
            </p>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && !editing && (
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="h-7 w-7"
              onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Editing state */}
      {editing ? (
        <div className="space-y-3">
          <StarRating value={editRating} onChange={setEditRating} />
          <Textarea
            rows={3}
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpdate}
              disabled={updateReview.isPending}>
              {updateReview.isPending ? "Saving…" : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <StarRating value={review.rating} readonly />
          {review.comment && (
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          )}
        </>
      )}

      {/* Delete confirm */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteReview.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteReview.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Page Skeleton ────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-8">
      <Skeleton className="h-72 w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.eventId as string;
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: event, isLoading, isError } = usePublicEventBySlug(slug);
  console.log(event)
  const { data: reviews, isLoading: reviewsLoading } = useEventReviews(
    event?.id ?? ""
  );

  const reviewsList = (reviews ?? []) as IPublicReview[];
  const avgRating =
    reviewsList.length > 0
      ? reviewsList.reduce((s, r) => s + r.rating, 0) / reviewsList.length
      : 0;

  const userHasReviewed = reviewsList.some((r) => r.userId === user?.id);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !event) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-muted-foreground px-4">
        Event not found.{" "}
        <Link href="/events" className="underline">
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Banner */}
      <div className="relative h-72 rounded-2xl overflow-hidden bg-muted">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-primary/20 to-muted" />
        )}
        {event.isFeatured && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-white shadow">
            <Star className="h-3.5 w-3.5 fill-white" /> Featured
          </span>
        )}
      </div>

      {/* Title + actions */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div className="space-y-2 min-w-0">
          {event.category && (
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {event.category.name}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>

          {/* Rating summary */}
          {reviewsList.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avgRating)} readonly />
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} · {reviewsList.length} review{reviewsList.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Join button */}
        <div className="shrink-0">
          <JoinButton
            eventId={event.id}
            feeType={event.feeType}
            currency={event.currency}
            registrationFee={event.registrationFee}
          />
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: CalendarDays,
            label: "Date & Time",
            value: `${new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric", year: "numeric",
            })} · ${event.time}`,
          },
          event.endDate && {
            icon: Clock,
            label: "Ends",
            value: new Date(event.endDate).toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric", year: "numeric",
            }),
          },
          (event.venue || event.eventLink) && {
            icon: MapPin,
            label: event.venue ? "Venue" : "Online",
            value: event.venue ?? "Online event",
          },
          event.eventLink && {
            icon: Link2,
            label: "Event Link",
            value: event.eventLink,
            isLink: true,
          },
          {
            icon: event.visibility === EventVisibility.PUBLIC ? Globe : Lock,
            label: "Visibility",
            value: event.visibility === EventVisibility.PUBLIC ? "Public" : "Private",
          },
          {
            icon: Banknote,
            label: "Fee",
            value:
              event.feeType === EventFeeType.FREE
                ? "Free"
                : `${event.currency} ${parseFloat(event.registrationFee).toLocaleString()}`,
          },
          event.maxCapacity && {
            icon: Users,
            label: "Capacity",
            value: `${event._count?.participants ?? 0} / ${event.maxCapacity} joined`,
          },
        ]
          .filter(Boolean)
          .map((item, i) => {
            const { icon: Icon, label, value, isLink } = item as {
              icon: React.ElementType;
              label: string;
              value: string;
              isLink?: boolean;
            };
            return (
              <div key={i} className="flex items-start gap-3 rounded-xl border bg-card p-4">
                <div className="rounded-md bg-muted p-2 shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {isLink ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary underline truncate block"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium">{value}</p>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">About this event</h2>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {event.description}
        </p>
      </div>

      {/* Organizer */}
      <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={event.owner.image ?? undefined} />
          <AvatarFallback>
            {event.owner.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs text-muted-foreground">Organized by</p>
          <p className="font-semibold">{event.owner.name}</p>
          <p className="text-xs text-muted-foreground">{event.owner.email}</p>
        </div>
      </div>

      {/* Reviews section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Reviews
            {reviewsList.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({reviewsList.length})
              </span>
            )}
          </h2>
          {user && !userHasReviewed && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowReviewForm((v) => !v)}
            >
              {showReviewForm ? "Cancel" : "Write a review"}
            </Button>
          )}
        </div>

        {/* Review form */}
        {showReviewForm && user && (
          <ReviewForm
            eventId={event.id}
            onSuccess={() => setShowReviewForm(false)}
          />
        )}

        {/* Reviews list */}
        {reviewsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : reviewsList.length === 0 ? (
          <div className="rounded-xl border bg-card py-10 text-center text-sm text-muted-foreground">
            No reviews yet.{" "}
            {user ? "Be the first to review!" : (
              <Link href="/login" className="underline">Login to review</Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {reviewsList.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                eventId={event.id}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}