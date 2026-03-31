"use client";

import { useState } from "react";
import { useMyJoinedEvents, useCreatePaymentSession } from "@/hooks/userDashboard.hooks";
import { IMyJoinedEvent } from "@/types/userDashboard.type";
import { ParticipantStatus, PaymentStatus, EventFeeType } from "@/types/enums";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import {
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Hourglass,
  CreditCard,
  Tag,
} from "lucide-react";
import Link from "next/link";

// ─── Helpers ─────────────────────────────────────────────────

const statusConfig: Record<
  ParticipantStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  PENDING: {
    label: "Pending Approval",
    icon: Hourglass,
    className: "text-amber-600 bg-amber-50 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "text-zinc-500 bg-zinc-50 border-zinc-200",
  },
  BANNED: {
    label: "Banned",
    icon: Ban,
    className: "text-red-600 bg-red-50 border-red-200",
  },
};

function ParticipantStatusBadge({ status }: { status: ParticipantStatus }) {
  const { label, icon: Icon, className } = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────

function JoinedCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden flex gap-0">
      <Skeleton className="w-28 shrink-0 rounded-none" />
      <div className="flex-1 p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-24 mt-2" />
      </div>
    </div>
  );
}

// ─── Joined Event Card ───────────────────────────────────────

function JoinedEventCard({ participation }: { participation: IMyJoinedEvent }) {
  const { event, status, joinedAt, banReason, payment } = participation;
  const paySession = useCreatePaymentSession();

  const needsPayment =
    event.feeType === EventFeeType.PAID &&
    status === ParticipantStatus.PENDING &&
    (!payment || payment.status !== PaymentStatus.PAID);

  const handlePay = () => {
    paySession.mutate({ eventId: event.id });
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden flex group hover:shadow-md transition-shadow">
      {/* Banner */}
      <div className="relative w-28 shrink-0 bg-muted">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Tag className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/events/${event.slug}`}
            className="font-semibold text-sm leading-snug line-clamp-2 hover:underline min-w-0"
          >
            {event.title}
          </Link>
          <ParticipantStatusBadge status={status} />
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · {event.time}
          </span>
          {(event.venue || event.eventLink) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{event.venue ?? "Online"}</span>
            </span>
          )}
          {joinedAt && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              Joined{" "}
              {new Date(joinedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Ban reason */}
        {status === ParticipantStatus.BANNED && banReason && (
          <p className="text-xs text-red-500 mt-1">
            Reason: {banReason}
          </p>
        )}

        {/* Pay now button */}
        {needsPayment && (
          <Button
            size="sm"
            className="mt-auto w-fit gap-1.5 text-xs h-7"
            onClick={handlePay}
            disabled={paySession.isPending}
          >
            <CreditCard className="h-3.5 w-3.5" />
            {paySession.isPending ? "Redirecting…" : `Pay ${event.currency} ${parseFloat(event.registrationFee).toLocaleString()}`}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

const PAGE_SIZE = 8;

export default function MyJoinedEvents() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | ParticipantStatus>(
    "ALL"
  );
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyJoinedEvents();
  const participation = (data ?? []) as IMyJoinedEvent[];

  const filtered =
    statusFilter === "ALL"
      ? participation
      : participation.filter((p) => p.status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // counts per status
  const counts = {
    ALL: participation.length,
    PENDING: participation.filter((p) => p.status === ParticipantStatus.PENDING).length,
    APPROVED: participation.filter((p) => p.status === ParticipantStatus.APPROVED).length,
    REJECTED: participation.filter((p) => p.status === ParticipantStatus.REJECTED).length,
    BANNED: participation.filter((p) => p.status === ParticipantStatus.BANNED).length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Joined Events</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Events you have joined or requested to join.
        </p>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Status pills */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              "ALL",
              ParticipantStatus.PENDING,
              ParticipantStatus.APPROVED,
              ParticipantStatus.REJECTED,
              ParticipantStatus.BANNED,
            ] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:border-foreground/40"
              }`}
            >
              {s === "ALL" ? "All" : statusConfig[s].label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  statusFilter === s
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <JoinedCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border bg-card py-16 text-center text-muted-foreground">
          Failed to load joined events. Please try again.
        </div>
      ) : paginated.length === 0 ? (
        <div className="rounded-lg border bg-card py-16 text-center space-y-2">
          <CalendarDays className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-sm text-muted-foreground">
            {statusFilter !== "ALL"
              ? `No ${statusConfig[statusFilter].label.toLowerCase()} events.`
              : "You haven't joined any events yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((p) => (
            <JoinedEventCard key={p.id} participation={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && filtered.length > PAGE_SIZE && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          showing={paginated.length}
          onPageChange={setPage}
          itemLabel="events"
        />
      )}
    </div>
  );
}