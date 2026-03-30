"use client";

import { useState } from "react";
import {
  useMyInvitations,
  useRespondToInvitation,
} from "@/hooks/userDashboard.hooks";
import { IMyInvitation } from "@/types/userDashboard.type";
import { InvitationStatus, EventFeeType } from "@/types/enums";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import {
  CalendarDays,
  MapPin,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  Tag,
} from "lucide-react";
import Link from "next/link";

// ─── Helpers ─────────────────────────────────────────────────

const statusConfig: Record<
  InvitationStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
};

function InvitationStatusBadge({ status }: { status: InvitationStatus }) {
  const { label, className } = statusConfig[status];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${className}`}>
      {label}
    </Badge>
  );
}

function getInitials(name: string | undefined) {
  return (name ?? "")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Skeleton ────────────────────────────────────────────────

function InvitationCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

// ─── Invitation Card ─────────────────────────────────────────

function InvitationCard({ invitation }: { invitation: IMyInvitation }) {
  const respondMutation = useRespondToInvitation();
  const { event, invitedBy, status, message, expiresAt } = invitation;

  const isPending = status === InvitationStatus.PENDING;
  const isResponding = respondMutation.isPending;

  const handleAccept = () =>
    respondMutation.mutate({
      invitationId: invitation.id,
      payload: { action: "ACCEPTED" },
    });

  const handleDecline = () =>
    respondMutation.mutate({
      invitationId: invitation.id,
      payload: { action: "DECLINED" },
    });

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4 hover:shadow-md transition-shadow">
      {/* Inviter + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={invitedBy?.image ?? undefined} />
            <AvatarFallback className="text-xs bg-muted">
              {getInitials(invitedBy?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-none truncate">
              {invitedBy?.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {invitedBy?.email}
            </p>
          </div>
        </div>
        <InvitationStatusBadge status={status} />
      </div>

      {/* Event info */}
      <div className="rounded-lg bg-muted/50 border p-3 flex gap-3">
        {/* Banner thumbnail */}
        <div className="h-14 w-14 shrink-0 rounded-md overflow-hidden bg-muted">
          {event.banner ? (
            <img
              src={event.banner}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Tag className="h-5 w-5 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <Link
            href={`/events/${event.slug}`}
            className="text-sm font-semibold leading-snug line-clamp-1 hover:underline"
          >
            {event.title}
          </Link>
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3 shrink-0" />
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · {event.time}
            </span>
            {event.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{event.venue}</span>
              </span>
            )}
          </div>
          {/* Fee */}
          <div className="pt-0.5">
            {event.feeType === EventFeeType.FREE ? (
              <Badge variant="secondary" className="text-[10px]">Free</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px]">
                {event.currency}{" "}
                {parseFloat(event.registrationFee).toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Personal message */}
      {message && (
        <div className="flex gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="italic line-clamp-2">&quot;{message}&quot;</p>
        </div>
      )}

      {/* Expiry */}
      {expiresAt && isPending && (
        <p className="flex items-center gap-1.5 text-xs text-amber-600">
          <Clock className="h-3.5 w-3.5" />
          Expires{" "}
          {new Date(expiresAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}

      {/* Action buttons — only if pending */}
      {isPending && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="gap-1.5 flex-1"
            onClick={handleAccept}
            disabled={isResponding}
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 flex-1"
            onClick={handleDecline}
            disabled={isResponding}
          >
            <XCircle className="h-4 w-4" />
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

const PAGE_SIZE = 6;

export default function MyInvitations() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | InvitationStatus>(
    "ALL"
  );
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyInvitations();
  const invitations = (data ?? []) as IMyInvitation[];

  const filtered =
    statusFilter === "ALL"
      ? invitations
      : invitations.filter((inv) => inv.status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    ALL: invitations.length,
    PENDING: invitations.filter((i) => i.status === InvitationStatus.PENDING).length,
    ACCEPTED: invitations.filter((i) => i.status === InvitationStatus.ACCEPTED).length,
    DECLINED: invitations.filter((i) => i.status === InvitationStatus.DECLINED).length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invitations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Event invitations sent to you by organisers.
        </p>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            "ALL",
            InvitationStatus.PENDING,
            InvitationStatus.ACCEPTED,
            InvitationStatus.DECLINED,
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

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <InvitationCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border bg-card py-16 text-center text-muted-foreground">
          Failed to load invitations. Please try again.
        </div>
      ) : paginated.length === 0 ? (
        <div className="rounded-lg border bg-card py-16 text-center space-y-2">
          <Mail className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-sm text-muted-foreground">
            {statusFilter !== "ALL"
              ? `No ${statusConfig[statusFilter].label.toLowerCase()} invitations.`
              : "You have no invitations yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginated.map((inv) => (
            <InvitationCard key={inv.id} invitation={inv} />
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
          itemLabel="invitations"
        />
      )}
    </div>
  );
}