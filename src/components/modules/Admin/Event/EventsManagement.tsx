"use client";

import { useState } from "react";
import {
    useAdminEvents,
    useAdminForceDeleteEvent,
    useSetFeaturedEvent,
} from "@/hooks/admin.hooks";
import {
    IEvent,

} from "@/types/event.types";
import {
    EventStatus,
    EventVisibility,
    EventFeeType,
} from "@/types/enums"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import {
    Search,
    MoreHorizontal,
    Star,
    Trash2,
    CalendarDays,
    Globe,
    Lock,
    Banknote,
    Tag,
    Users,
} from "lucide-react";
import DeleteEventDialog from "./DeleteEventDialog";
import Link from "next/link";

// ─── Badge helpers ───────────────────────────────────────────

const statusConfig: Record<
    EventStatus,
    { label: string; className: string }
> = {
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

function VisibilityBadge({ visibility }: { visibility: EventVisibility }) {
    return visibility === EventVisibility.PUBLIC ? (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" /> Public
        </span>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Private
        </span>
    );
}

function FeeTypeBadge({ feeType, fee, currency }: { feeType: EventFeeType; fee: string; currency: string }) {
    return feeType === EventFeeType.FREE ? (
        <Badge variant="secondary" className="text-xs">Free</Badge>
    ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
            <Banknote className="h-3 w-3 text-muted-foreground" />
            {currency} {parseFloat(fee).toLocaleString()}
        </span>
    );
}

// ─── Table skeleton ──────────────────────────────────────────

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-md shrink-0" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-3.5 w-40" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-3.5 w-24" />
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
            ))}
        </>
    );
}

// ─── Row actions dropdown ────────────────────────────────────

function EventRowActions({
    event,
    onDelete,
    onFeature,
}: {
    event: IEvent;
    onDelete: (event: IEvent) => void;
    onFeature: (event: IEvent) => void;
}) {
    const setFeatured = useSetFeaturedEvent();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">

                {/* Participants Management */}
                <DropdownMenuItem asChild>
                    <Link
                        href={`/admin/events/${event.id}/participants`}
                        className="flex items-center"
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Manage Participants
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onFeature(event)}
                    disabled={setFeatured.isPending}
                >
                    <Star className="mr-2 h-4 w-4 text-amber-500" />
                    {event.isFeatured ? "Remove Featured" : "Set as Featured"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => onDelete(event)}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Force Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ─── Delete confirm dialog ───────────────────────────────────


// ─── Main Page ───────────────────────────────────────────────

const LIMIT = 10;

export default function EventsManagement() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | EventStatus>("ALL");
    const [visibilityFilter, setVisibilityFilter] = useState<"ALL" | EventVisibility>("ALL");
    const [feeTypeFilter, setFeeTypeFilter] = useState<"ALL" | EventFeeType>("ALL");

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

    const setFeaturedMutation = useSetFeaturedEvent();

    const { data, isLoading, isError } = useAdminEvents({
        page,
        limit: LIMIT,
        search: search || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        visibility: visibilityFilter !== "ALL" ? visibilityFilter : undefined,
        feeType: feeTypeFilter !== "ALL" ? feeTypeFilter : undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const events = Array.isArray(data?.data) ? data.data : [];
    const total = (data?.meta as { total?: number })?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    const hasActiveFilter =
        search ||
        statusFilter !== "ALL" ||
        visibilityFilter !== "ALL" ||
        feeTypeFilter !== "ALL";

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setVisibilityFilter("ALL");
        setFeeTypeFilter("ALL");
        setPage(1);
    };

    const openDelete = (event: IEvent) => {
        setSelectedEvent(event);
        setDeleteOpen(true);
    };

    const handleFeature = async (event: IEvent) => {
        await setFeaturedMutation.mutateAsync(event.id);
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <CalendarDays className="h-6 w-6 text-muted-foreground" />
                    Events
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage all events across the platform.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-50 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search events…"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="pl-9"
                    />
                </div>

                {/* Status */}
                <Select
                    value={statusFilter}
                    onValueChange={(v) => {
                        setStatusFilter(v as "ALL" | EventStatus);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-35">
                        <SelectValue placeholder="Status" />
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

                {/* Visibility */}
                <Select
                    value={visibilityFilter}
                    onValueChange={(v) => {
                        setVisibilityFilter(v as "ALL" | EventVisibility);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-32.5">
                        <SelectValue placeholder="Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value={EventVisibility.PUBLIC}>Public</SelectItem>
                        <SelectItem value={EventVisibility.PRIVATE}>Private</SelectItem>
                    </SelectContent>
                </Select>

                {/* Fee type */}
                <Select
                    value={feeTypeFilter}
                    onValueChange={(v) => {
                        setFeeTypeFilter(v as "ALL" | EventFeeType);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-30">
                        <SelectValue placeholder="Fee" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Fees</SelectItem>
                        <SelectItem value={EventFeeType.FREE}>Free</SelectItem>
                        <SelectItem value={EventFeeType.PAID}>Paid</SelectItem>
                    </SelectContent>
                </Select>

                {/* Clear */}
                {hasActiveFilter && (
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                        Clear filters
                    </Button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="min-w-55">Event</TableHead>
                            <TableHead className="w-27.5">Visibility</TableHead>
                            <TableHead className="w-30">Fee</TableHead>
                            <TableHead className="w-30">Status</TableHead>
                            <TableHead className="w-35">Date</TableHead>
                            <TableHead className="w-45">Organizer</TableHead>
                            <TableHead className="w-15 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading ? (
                            <TableSkeleton />
                        ) : isError ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-12 text-center text-muted-foreground"
                                >
                                    Failed to load events. Please try again.
                                </TableCell>
                            </TableRow>
                        ) : events.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-12 text-center text-muted-foreground"
                                >
                                    {hasActiveFilter
                                        ? "No events match your filters."
                                        : "No events found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            events?.map((event) => (
                                <TableRow key={event.id} className="group">
                                    {/* Event title + banner + featured star */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {/* Banner thumbnail */}
                                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted">
                                                {event.banner ? (
                                                    <img
                                                        src={event.banner}
                                                        alt={event.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Tag className="h-4 w-4 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="flex items-center gap-1.5 text-sm font-medium leading-none truncate">
                                                    {event.title}
                                                    {event.isFeatured && (
                                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                                                    )}
                                                </p>
                                                {event.category && (
                                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                                        {event.category.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Visibility */}
                                    <TableCell>
                                        <VisibilityBadge visibility={event.visibility} />
                                    </TableCell>

                                    {/* Fee */}
                                    <TableCell>
                                        <FeeTypeBadge
                                            feeType={event.feeType}
                                            fee={event.registrationFee}
                                            currency={event.currency}
                                        />
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <StatusBadge status={event.status} />
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                                        {new Date(event.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </TableCell>

                                    {/* Organizer */}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={event.owner.image ?? undefined} />
                                                <AvatarFallback className="text-[10px]">
                                                    {event.owner.name
                                                        .split(" ")
                                                        .map((n: string) => n[0])
                                                        .slice(0, 2)
                                                        .join("")
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs truncate max-w-27.5">
                                                {event.owner.name}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right">
                                        <EventRowActions
                                            event={event}
                                            onDelete={openDelete}
                                            onFeature={handleFeature}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                {!isLoading && !isError && total > 0 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        showing={events.length}
                        onPageChange={(p) => {
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        itemLabel="events"
                    />
                )}
            </div>

            {/* Delete dialog */}
            <DeleteEventDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                event={selectedEvent}
            />
        </div>
    );
}