"use client";


import { useAuth } from "@/context/AuthContext";
import {
  EventStatus,
  ParticipantStatus,
  PaymentStatus,
  InvitationStatus,
  NotificationType,
} from "@/types/enums";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  CircleDollarSign,
  Mail,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Tag,
  ArrowRight,
  Star,
  UserCheck,
  Ban,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { IMyEvent, IMyInvitation, IMyJoinedEvent, IMyPayment } from "@/types/userDashboard.type";
import { INotification } from "@/types/notification.types";
import { useMyEvents, useMyInvitations, useMyJoinedEvents, useMyPayments } from "@/hooks/userDashboard.hooks";
import { useMyNotifications } from "@/hooks/notification.hooks";
import { UserCharts } from "./UserCharts";

// ─── Helpers ──────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Stat Card ────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, iconBg, iconColor, loading, href,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; iconBg: string; iconColor: string;
  loading?: boolean; href?: string;
}) {
  const inner = (
    <div className={`rounded-xl border bg-card p-5 flex items-start justify-between gap-4 ${href ? "hover:shadow-md transition-shadow cursor-pointer" : ""}`}>
      <div className="space-y-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <><Skeleton className="h-7 w-20 mt-1" />{sub && <Skeleton className="h-3 w-28 mt-1" />}</>
        ) : (
          <><p className="text-2xl font-bold tracking-tight">{value}</p>{sub && <p className="text-xs text-muted-foreground">{sub}</p>}</>
        )}
      </div>
      <div className={`rounded-md p-2.5 shrink-0 ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}

// ─── My Events Summary ────────────────────────────────────────

function MyEventsSummary({ events, loading }: { events: IMyEvent[]; loading: boolean }) {
  const statusCfg: Record<EventStatus, string> = {
    PUBLISHED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    DRAFT: "bg-zinc-100 text-zinc-600 border-zinc-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
    COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <div className="rounded-xl border bg-card">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="text-base font-semibold">My Recent Events</h2>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/dashboard/my-events">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </div>
      <div className="divide-y">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Skeleton className="h-10 w-10 rounded-md shrink-0" />
              <div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-40" /><Skeleton className="h-3 w-24" /></div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))
        ) : events.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No events yet. <Link href="/dashboard/my-events/create" className="underline">Create one</Link>
          </div>
        ) : (
          events.slice(0, 4).map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors">
              <div className="h-10 w-10 shrink-0 rounded-md overflow-hidden bg-muted">
                {event.banner
                  ? <img src={event.banner} alt={event.title} className="h-full w-full object-cover" />
                  : <div className="flex h-full w-full items-center justify-center"><Tag className="h-4 w-4 text-muted-foreground/30" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {event._count?.participants !== undefined && ` · ${event._count.participants} joined`}
                </p>
              </div>
              <Badge variant="outline" className={`text-[10px] font-medium shrink-0 ${statusCfg[event.status]}`}>
                {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
              </Badge>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Joined Events Summary ────────────────────────────────────

function JoinedEventsSummary({ joined, loading }: { joined: IMyJoinedEvent[]; loading: boolean }) {
  const statusIcon: Record<ParticipantStatus, React.ReactNode> = {
    PENDING:  <Clock className="h-3.5 w-3.5 text-amber-500" />,
    APPROVED: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    REJECTED: <XCircle className="h-3.5 w-3.5 text-zinc-400" />,
    BANNED:   <Ban className="h-3.5 w-3.5 text-red-500" />,
  };

  return (
    <div className="rounded-xl border bg-card">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="text-base font-semibold">Joined Events</h2>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/dashboard/joined-events">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </div>
      <div className="divide-y">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Skeleton className="h-10 w-10 rounded-md shrink-0" />
              <div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-40" /><Skeleton className="h-3 w-24" /></div>
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          ))
        ) : joined.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No joined events. <Link href="/events" className="underline">Browse events</Link>
          </div>
        ) : (
          joined.slice(0, 4).map((p) => (
            <Link key={p.id} href={`/events/${p.event.slug}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors">
              <div className="h-10 w-10 shrink-0 rounded-md overflow-hidden bg-muted">
                {p.event.banner
                  ? <img src={p.event.banner} alt={p.event.title} className="h-full w-full object-cover" />
                  : <div className="flex h-full w-full items-center justify-center"><Tag className="h-4 w-4 text-muted-foreground/30" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(p.event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <span title={p.status}>{statusIcon[p.status]}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Notifications List ───────────────────────────────────────

const notifIconMap: Partial<Record<NotificationType, { icon: React.ElementType; bg: string; color: string }>> = {
  JOIN_REQUEST:        { icon: UserCheck,    bg: "bg-blue-50",    color: "text-blue-600" },
  REQUEST_APPROVED:    { icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600" },
  REQUEST_REJECTED:    { icon: XCircle,      bg: "bg-zinc-100",   color: "text-zinc-500" },
  INVITATION_RECEIVED: { icon: Mail,         bg: "bg-violet-50",  color: "text-violet-600" },
  INVITATION_ACCEPTED: { icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600" },
  INVITATION_DECLINED: { icon: XCircle,      bg: "bg-zinc-100",   color: "text-zinc-500" },
  PARTICIPANT_BANNED:  { icon: Ban,          bg: "bg-red-50",     color: "text-red-600" },
  PAYMENT_SUCCESS:     { icon: CreditCard,   bg: "bg-emerald-50", color: "text-emerald-600" },
  PAYMENT_FAILED:      { icon: CreditCard,   bg: "bg-red-50",     color: "text-red-500" },
  EVENT_UPDATED:       { icon: CalendarDays, bg: "bg-amber-50",   color: "text-amber-600" },
  EVENT_CANCELLED:     { icon: ShieldAlert,  bg: "bg-red-50",     color: "text-red-600" },
  REVIEW_RECEIVED:     { icon: Star,         bg: "bg-amber-50",   color: "text-amber-500" },
};

function NotificationsList({ notifications, loading }: { notifications: INotification[]; loading: boolean }) {
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="rounded-xl border bg-card">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Notifications</h2>
          {unread > 0 && <Badge className="rounded-full text-[10px] px-1.5 h-auto">{unread} new</Badge>}
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/dashboard/notifications">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </div>
      <div className="divide-y">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
              <Skeleton className="h-3 w-10 shrink-0" />
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          notifications.slice(0, 6).map((n) => {
            const cfg = notifIconMap[n.type] ?? { icon: Bell, bg: "bg-muted", color: "text-muted-foreground" };
            const Icon = cfg.icon;
            return (
              <div key={n.id}
                className={`flex items-start gap-3 px-5 py-3 transition-colors ${!n.isRead ? "bg-primary/5" : "hover:bg-muted/40"}`}>
                <div className={`rounded-full p-1.5 shrink-0 ${cfg.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-medium leading-snug">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                  {!n.isRead && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Pending Invitations ──────────────────────────────────────

function PendingInvitations({ invitations, loading }: { invitations: IMyInvitation[]; loading: boolean }) {
  const pending = invitations.filter((i) => i.status === InvitationStatus.PENDING);
  if (!loading && pending.length === 0) return null;

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/50">
      <div className="px-5 py-4 border-b border-violet-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-violet-600" />
          <h2 className="text-base font-semibold text-violet-800">Pending Invitations</h2>
          {pending.length > 0 && (
            <Badge className="rounded-full text-[10px] px-1.5 h-auto bg-violet-600 text-white border-0">
              {pending.length}
            </Badge>
          )}
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-violet-700 hover:text-violet-900">
          <Link href="/dashboard/invitations">Respond <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </div>
      <div className="divide-y divide-violet-100">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5"><Skeleton className="h-3.5 w-40" /><Skeleton className="h-3 w-24" /></div>
              <Skeleton className="h-7 w-16" />
            </div>
          ))
        ) : (
          pending.slice(0, 3).map((inv) => (
            <div key={inv.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={inv.invitedBy.image ?? undefined} />
                <AvatarFallback className="text-xs">{getInitials(inv.invitedBy.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-violet-900">{inv.event.title}</p>
                <p className="text-xs text-violet-600">from {inv.invitedBy.name}</p>
              </div>
              <Button asChild size="sm" variant="outline"
                className="shrink-0 h-7 text-xs border-violet-300 text-violet-700 hover:bg-violet-100">
                <Link href="/dashboard/invitations">Respond</Link>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export default function UserDashboard() {
  const { user } = useAuth();

  const { data: eventsData, isLoading: eventsLoading } = useMyEvents({ page: 1, limit: 50 });
  const { data: joinedData,  isLoading: joinedLoading }   = useMyJoinedEvents();
  const { data: paymentsData,isLoading: paymentsLoading } = useMyPayments();
  const { data: notifData,   isLoading: notifLoading }    = useMyNotifications();
  const { data: inviteData,  isLoading: inviteLoading }   = useMyInvitations();

  const events       = (eventsData?.data  ?? []) as IMyEvent[];
  const joined       = (joinedData        ?? []) as IMyJoinedEvent[];
  const payments     = (paymentsData      ?? []) as IMyPayment[];
  const notifications= (notifData         ?? []) as INotification[];
  const invitations  = (inviteData        ?? []) as IMyInvitation[];

  // derived stats
  const publishedEvents  = events.filter((e) => e.status === EventStatus.PUBLISHED).length;
  const draftEvents      = events.filter((e) => e.status === EventStatus.DRAFT).length;
  const approvedJoined   = joined.filter((j) => j.status === ParticipantStatus.APPROVED).length;
  const pendingJoined    = joined.filter((j) => j.status === ParticipantStatus.PENDING).length;
  const totalSpent       = payments
    .filter((p) => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    .toLocaleString("en-US", { minimumFractionDigits: 2 });
  const unreadNotifs     = notifications.filter((n) => !n.isRead).length;
  const pendingInvites   = invitations.filter((i) => i.status === InvitationStatus.PENDING).length;

  return (
    <div className="space-y-8 p-6">
      {/* Welcome header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.image ?? undefined} />
          <AvatarFallback>{user?.name ? getInitials(user.name) : "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s what&apos;s happening with your events.
          </p>
        </div>
      </div>

      {/* Top 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Events"     value={eventsData?.meta?.total ?? events.length}
          sub={`${publishedEvents} published · ${draftEvents} draft`}
          icon={CalendarDays} iconBg="bg-violet-50" iconColor="text-violet-600"
          loading={eventsLoading} href="/dashboard/my-events" />
        <StatCard label="Joined Events" value={joined.length}
          sub={`${approvedJoined} approved · ${pendingJoined} pending`}
          icon={UserCheck} iconBg="bg-blue-50" iconColor="text-blue-600"
          loading={joinedLoading} href="/dashboard/joined-events" />
        <StatCard label="Total Spent"   value={`BDT ${totalSpent}`}
          sub="On paid events"
          icon={CircleDollarSign} iconBg="bg-emerald-50" iconColor="text-emerald-600"
          loading={paymentsLoading} href="/dashboard/payments" />
        <StatCard label="Unread Notifs" value={unreadNotifs}
          sub={`${notifications.length} total`}
          icon={Bell} iconBg="bg-amber-50" iconColor="text-amber-600"
          loading={notifLoading} href="/dashboard/notifications" />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Invitations"     value={pendingInvites}
          sub="Pending response"
          icon={Mail} iconBg="bg-pink-50" iconColor="text-pink-600"
          loading={inviteLoading} href="/dashboard/invitations" />
        <StatCard label="Confirmed Spots" value={approvedJoined}
          sub="Approved joins"
          icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600"
          loading={joinedLoading} />
        <StatCard label="Payments Made"   value={payments.filter((p) => p.status === PaymentStatus.PAID).length}
          sub="Successful"
          icon={TrendingUp} iconBg="bg-blue-50" iconColor="text-blue-600"
          loading={paymentsLoading} />
        <StatCard label="Events Hosted"   value={publishedEvents}
          sub="Published & live"
          icon={Star} iconBg="bg-amber-50" iconColor="text-amber-500"
          loading={eventsLoading} />
      </div>

      {/* Dashboard Charts */}
      <UserCharts />

      {/* Pending invitations alert */}
      <PendingInvitations invitations={invitations} loading={inviteLoading} />

      {/* Events grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MyEventsSummary  events={events} loading={eventsLoading} />
        <JoinedEventsSummary joined={joined} loading={joinedLoading} />
      </div>

      {/* Notifications */}
      <NotificationsList notifications={notifications} loading={notifLoading} />
    </div>
  );
}