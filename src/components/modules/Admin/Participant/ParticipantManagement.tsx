"use client";

import { useState } from "react";
import {
  useEventParticipants,
  useApproveParticipant,
  useRejectParticipant,
  useBanParticipant,
} from "@/hooks/admin.hooks";
import { IEventParticipant,  } from "@/types/participant.types";
import { ParticipantStatus  } from "@/types/enums";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Ban,
  Users,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────

interface ParticipantsManagementProps {
  /** Pass eventId from page params e.g. from useParams() */
  eventId: string;
}

// ─── Helpers ────────────────────────────────────────────────

const statusConfig: Record<
  ParticipantStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
  BANNED: {
    label: "Banned",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

function StatusBadge({ status }: { status: ParticipantStatus }) {
  const { label, className } = statusConfig[status];
  return (
    <Badge variant="outline" className={`text-xs font-medium ${className}`}>
      {label}
    </Badge>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Table Skeleton ──────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ─── Ban Dialog ──────────────────────────────────────────────

function BanParticipantDialog({
  open,
  onOpenChange,
  participant,
  eventId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  participant: IEventParticipant | null;
  eventId: string;
}) {
  const [reason, setReason] = useState("");
  const banMutation = useBanParticipant(eventId);

  const handleConfirm = async () => {
    if (!participant) return;
    const res = await banMutation.mutateAsync({
      userId: participant.userId,
      payload: { banReason: reason.trim() },
    });
    if (res.success) {
      setReason("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!v) setReason("");
      onOpenChange(v);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Ban className="h-4 w-4 text-destructive" />
            Ban &quot;{participant?.user.name}&quot;
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            This will remove the participant and prevent them from rejoining.
            Provide a reason so they understand why.
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="ban-reason">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="ban-reason"
              placeholder="e.g. Repeated violation of event code of conduct"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            disabled={banMutation.isPending}
            onClick={() => {
              setReason("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={banMutation.isPending || !reason.trim()}
            onClick={handleConfirm}
          >
            {banMutation.isPending ? "Banning…" : "Ban Participant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Reject Dialog ───────────────────────────────────────────

function RejectParticipantDialog({
  open,
  onOpenChange,
  participant,
  eventId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  participant: IEventParticipant | null;
  eventId: string;
}) {
  const rejectMutation = useRejectParticipant(eventId);

  const handleConfirm = async () => {
    if (!participant) return;
    const res = await rejectMutation.mutateAsync(participant.userId);
    if (res.success) onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Reject &quot;{participant?.user.name}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will reject their join request. They will be notified and can
            request again unless banned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={rejectMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={rejectMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {rejectMutation.isPending ? "Rejecting…" : "Reject"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Row Actions ─────────────────────────────────────────────

function ParticipantRowActions({
  participant,
  eventId,
  onBan,
  onReject,
}: {
  participant: IEventParticipant;
  eventId: string;
  onBan: (p: IEventParticipant) => void;
  onReject: (p: IEventParticipant) => void;
}) {
  const approveMutation = useApproveParticipant(eventId);
  const status = participant.status;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {/* Approve — only if PENDING or REJECTED */}
        {(status === ParticipantStatus.PENDING ||
          status === ParticipantStatus.REJECTED) && (
          <DropdownMenuItem
            onClick={() =>
              approveMutation.mutate(participant.userId)
            }
            disabled={approveMutation.isPending}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
            Approve
          </DropdownMenuItem>
        )}

        {/* Reject — only if PENDING or APPROVED */}
        {(status === ParticipantStatus.PENDING ||
          status === ParticipantStatus.APPROVED) && (
          <DropdownMenuItem onClick={() => onReject(participant)}>
            <XCircle className="mr-2 h-4 w-4 text-zinc-500" />
            Reject
          </DropdownMenuItem>
        )}

        {/* Ban — not already banned */}
        {status !== ParticipantStatus.BANNED && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onBan(participant)}
              className="text-destructive focus:text-destructive"
            >
              <Ban className="mr-2 h-4 w-4" />
              Ban
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Main Component ──────────────────────────────────────────

const PAGE_SIZE = 10;

export default function ParticipantsManagement({
  eventId,
}: ParticipantsManagementProps) {
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | ParticipantStatus
  >("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [banOpen, setBanOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<IEventParticipant | null>(null);

  const { data, isLoading, isError } = useEventParticipants(
    eventId,
    statusFilter !== "ALL" ? statusFilter : undefined
  );

  const participants = (data as IEventParticipant[] | undefined) ?? [];

  // client-side search on top of server status filter
  const filtered = participants.filter((p) => {
    const q = search.toLowerCase();
    return (
      !search ||
      p.user.name.toLowerCase().includes(q) ||
      p.user.email.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const openBan = (p: IEventParticipant) => {
    setSelectedParticipant(p);
    setBanOpen(true);
  };

  const openReject = (p: IEventParticipant) => {
    setSelectedParticipant(p);
    setRejectOpen(true);
  };

  // ── Status tab counts ──
  const counts = {
    ALL: participants.length,
    PENDING: participants.filter(
      (p) => p.status === ParticipantStatus.PENDING
    ).length,
    APPROVED: participants.filter(
      (p) => p.status === ParticipantStatus.APPROVED
    ).length,
    REJECTED: participants.filter(
      (p) => p.status === ParticipantStatus.REJECTED
    ).length,
    BANNED: participants.filter(
      (p) => p.status === ParticipantStatus.BANNED
    ).length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-muted-foreground" />
          Participants
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage join requests and participants for this event.
        </p>
      </div>

      {/* Status tabs + search row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Status filter pills */}
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

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-50">Participant</TableHead>
              <TableHead className="w-30">Status</TableHead>
              <TableHead className="w-42.5">Joined At</TableHead>
              <TableHead className="w-42.5">Requested At</TableHead>
              <TableHead className="w-15 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground"
                >
                  Failed to load participants. Please try again.
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground"
                >
                  {search
                    ? `No participants match "${search}"`
                    : statusFilter !== "ALL"
                    ? `No ${statusConfig[statusFilter].label.toLowerCase()} participants.`
                    : "No participants yet."}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((participant) => (
                <TableRow key={participant.id}>
                  {/* User */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={participant.user.image ?? undefined}
                        />
                        <AvatarFallback className="text-xs bg-muted">
                          {getInitials(participant.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-none truncate">
                          {participant.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {participant.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div className="space-y-1">
                      <StatusBadge status={participant.status} />
                      {/* Show ban reason if banned */}
                      {participant.status === ParticipantStatus.BANNED &&
                        participant.banReason && (
                          <p className="text-[10px] text-muted-foreground max-w-40 truncate">
                            {participant.banReason}
                          </p>
                        )}
                    </div>
                  </TableCell>

                  {/* Joined At */}
                  <TableCell className="text-sm text-muted-foreground">
                    {participant.joinedAt
                      ? new Date(participant.joinedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "—"}
                  </TableCell>

                  {/* Requested At */}
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(participant.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <ParticipantRowActions
                      participant={participant}
                      eventId={eventId}
                      onBan={openBan}
                      onReject={openReject}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && !isError && filtered.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={filtered.length}
            showing={paginated.length}
            onPageChange={setPage}
            itemLabel="participants"
          />
        )}
      </div>

      {/* Dialogs */}
      <BanParticipantDialog
        open={banOpen}
        onOpenChange={setBanOpen}
        participant={selectedParticipant}
        eventId={eventId}
      />
      <RejectParticipantDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        participant={selectedParticipant}
        eventId={eventId}
      />
    </div>
  );
}