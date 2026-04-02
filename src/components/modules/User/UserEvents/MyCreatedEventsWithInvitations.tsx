"use client";

import { useState } from "react";
import { useMyEvents, useDeleteMyEvent } from "@/hooks/userDashboard.hooks";
import { IMyEvent, IMyEventsQueryParams } from "@/types/userDashboard.type";
import { EventStatus, EventFeeType, EventVisibility } from "@/types/enums";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import {
  CalendarDays,
  MapPin,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Globe,
  Lock,
  Banknote,
  Tag,
  Star,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { SendBulkInvitationsDialog } from "../../BulkInvitations/SendBulkInvitationsDialog";
import { useAuth } from "@/context/AuthContext";

// ─── Helpers ─────────────────────────────────────────────────

const statusConfig: Record<EventStatus, { label: string; className: string }> =
{
  PUBLISHED: {
    label: "Published",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  DRAFT: {
    label: "Draft",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
};

function StatusBadge({ status }: { status: EventStatus }) {
  const { label, className } = statusConfig[status];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${className}`}>
      {label}
    </Badge>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────

function EventCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Skeleton className="h-36 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>
    </div>
  );
}

// ─── Event Card ──────────────────────────────────────────────

function EventCard({
  event,
  onDelete,
  onInvite,
}: {
  event: IMyEvent;
  onDelete: (e: IMyEvent) => void;
  onInvite: (e: IMyEvent) => void;
}) {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN";
  return (
    <div className="rounded-xl border bg-card overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      {/* Banner */}
      <div className="relative h-36 bg-muted shrink-0">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Tag className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
        {/* Featured star */}
        {event.isFeatured && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-semibold text-white">
            <Star className="h-3 w-3 fill-white" /> Featured
          </span>
        )}
        {/* Actions dropdown */}
        <div className="absolute top-2 right-2 flex gap-2">
          {/* Send Invitation Button */}
          <Button
            size="icon"
            variant="secondary"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onInvite(event)}
            title="Send invitations"
          >
            <Mail className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link href={`/${isAdmin ? "admin" : "dashboard"}/my-events/${event.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(event)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="space-y-1 min-w-0">
          <p className="font-semibold text-sm leading-snug line-clamp-2">
            {event.title}
          </p>
          {event.category && (
            <p className="text-xs text-muted-foreground">
              {event.category.name}
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
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
          {event.maxCapacity && (
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0" />
              {event._count?.participants ?? 0} / {event.maxCapacity} joined
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          <StatusBadge status={event.status} />
          <Badge variant="outline" className="text-xs gap-1">
            {event.visibility === EventVisibility.PUBLIC ? (
              <>
                <Globe className="h-3 w-3" /> Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" /> Private
              </>
            )}
          </Badge>
          {event.feeType === EventFeeType.FREE ? (
            <Badge variant="secondary" className="text-xs">
              Free
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs gap-1">
              <Banknote className="h-3 w-3" />
              {event.currency} {parseFloat(event.registrationFee).toLocaleString()}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Delete Dialog ───────────────────────────────────────────

function DeleteEventDialog({
  open,
  onOpenChange,
  event,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  event: IMyEvent | null;
}) {
  const deleteMutation = useDeleteMyEvent();

  const handleConfirm = async () => {
    if (!event) return;
    const res = await deleteMutation.mutateAsync(event.id);
    if (res.success) onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{event?.title}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your event and all its data. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Main Page ───────────────────────────────────────────────

const LIMIT = 9; // 3-col grid looks best with multiples of 3

export default function MyCreatedEvents() {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN";
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"ALL" | EventStatus>("ALL");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IMyEvent | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const params: IMyEventsQueryParams = {
    page,
    limit: LIMIT,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
  };

  const { data, isLoading, isError } = useMyEvents(params);

  const events: IMyEvent[] = data?.data ?? [];
  const total: number = data?.meta?.total ?? 0;
  const totalPages: number = data?.meta?.totalPages ?? 1;

  const openDelete = (event: IMyEvent) => {
    setSelectedEvent(event);
    setDeleteOpen(true);
  };

  const openInvite = (event: IMyEvent) => {
    setSelectedEvent(event);
    setInviteDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Events you have created and manage.
          </p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href={`/${isAdmin ? "admin" : "dashboard"}/my-events/create`}>
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as "ALL" | EventStatus);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.values(EventStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {statusConfig[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {total} event{total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border bg-card py-16 text-center text-muted-foreground">
          Failed to load events. Please try again.
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-lg border bg-card py-16 text-center space-y-3">
          <CalendarDays className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground text-sm">
            {statusFilter !== "ALL"
              ? `No ${statusConfig[statusFilter].label.toLowerCase()} events.`
              : "You haven't created any events yet."}
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/${isAdmin ? "admin" : "dashboard"}/my-events/create`}>Create your first event</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={openDelete}
              onInvite={openInvite}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && total > LIMIT && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          showing={events.length}
          onPageChange={setPage}
          itemLabel="events"
        />
      )}

      <DeleteEventDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        event={selectedEvent}
      />

      <SendBulkInvitationsDialog
        event={selectedEvent}
        isOpen={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
}