"use client";

import { useState } from "react";
import { useMyNotifications } from "@/hooks/notification.hooks";
import { INotification } from "@/types/notification.types";
import { NotificationType } from "@/types/enums";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Mail,
  CreditCard,
  CalendarDays,
  Star,
  ShieldAlert,
  UserCheck,
  UserX,
  Ban,
} from "lucide-react";
import Link from "next/link";

// ─── Notification config ──────────────────────────────────────

const notificationConfig: Record<
  NotificationType,
  {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    label: string;
  }
> = {
  JOIN_REQUEST: {
    icon: UserCheck,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    label: "Join Request",
  },
  REQUEST_APPROVED: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    label: "Request Approved",
  },
  REQUEST_REJECTED: {
    icon: UserX,
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-500",
    label: "Request Rejected",
  },
  INVITATION_RECEIVED: {
    icon: Mail,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    label: "Invitation",
  },
  INVITATION_ACCEPTED: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    label: "Invitation Accepted",
  },
  INVITATION_DECLINED: {
    icon: XCircle,
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-500",
    label: "Invitation Declined",
  },
  PARTICIPANT_BANNED: {
    icon: Ban,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    label: "Banned",
  },
  PAYMENT_SUCCESS: {
    icon: CreditCard,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    label: "Payment Success",
  },
  PAYMENT_FAILED: {
    icon: CreditCard,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    label: "Payment Failed",
  },
  EVENT_UPDATED: {
    icon: CalendarDays,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    label: "Event Updated",
  },
  EVENT_CANCELLED: {
    icon: ShieldAlert,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    label: "Event Cancelled",
  },
  REVIEW_RECEIVED: {
    icon: Star,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    label: "New Review",
  },
};

// ─── Helpers ─────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getActionLink(notification: INotification): string | null {
  const meta = notification.metadata;
  if (!meta) return null;

  switch (notification.type) {
    case NotificationType.JOIN_REQUEST:
    case NotificationType.REQUEST_APPROVED:
    case NotificationType.REQUEST_REJECTED:
    case NotificationType.EVENT_UPDATED:
    case NotificationType.EVENT_CANCELLED:
    case NotificationType.REVIEW_RECEIVED:
      return meta.eventId ? `/events/${meta.eventSlug ?? meta.eventId}` : null;

    case NotificationType.INVITATION_RECEIVED:
    case NotificationType.INVITATION_ACCEPTED:
    case NotificationType.INVITATION_DECLINED:
      return "/dashboard/invitations";

    case NotificationType.PAYMENT_SUCCESS:
    case NotificationType.PAYMENT_FAILED:
      return "/dashboard/payments";

    case NotificationType.PARTICIPANT_BANNED:
      return "/dashboard/joined-events";

    default:
      return null;
  }
}

// ─── Notification Item ────────────────────────────────────────

function NotificationItem({ notification }: { notification: INotification }) {
  const config = notificationConfig[notification.type];
  const Icon = config.icon;
  const link = getActionLink(notification);

  const content = (
    <div
      className={`flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/40 ${
        !notification.isRead ? "bg-primary/5 border-primary/20" : "bg-card"
      }`}
    >
      {/* Icon */}
      <div className={`rounded-full p-2.5 shrink-0 ${config.iconBg}`}>
        <Icon className={`h-4 w-4 ${config.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium leading-snug">{notification.title}</p>
          <span className="text-xs text-muted-foreground shrink-0">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {notification.message}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
      )}
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}

// ─── Skeleton ─────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-xl border bg-card p-4">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

const PAGE_SIZE = 10;

type FilterTab = "ALL" | "UNREAD" | "READ";

export default function NotificationsPage() {
  const [tab, setTab] = useState<FilterTab>("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyNotifications();
  console.log(data)
  const notifications = Array.isArray(data) ? data : [];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered =
    tab === "ALL"
      ? notifications
      : tab === "UNREAD"
      ? notifications.filter((n) => !n.isRead)
      : notifications.filter((n) => n.isRead);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "ALL", label: "All", count: notifications.length },
    { key: "UNREAD", label: "Unread", count: unreadCount },
    { key: "READ", label: "Read", count: notifications.length - unreadCount },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-muted-foreground" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="rounded-full text-xs px-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay up to date with your events and activity.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              tab === t.key
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:border-foreground/40"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                tab === t.key
                  ? "bg-background/20 text-background"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border bg-card py-16 text-center text-muted-foreground">
          Failed to load notifications. Please try again.
        </div>
      ) : paginated.length === 0 ? (
        <div className="rounded-xl border bg-card py-16 text-center space-y-2">
          <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">
            {tab === "UNREAD"
              ? "You're all caught up!"
              : "No notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {paginated.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
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
          itemLabel="notifications"
        />
      )}
    </div>
  );
}