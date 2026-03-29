"use client";

import { useAdminDashboardStats, useAdminEvents, useAdminPayments, useUsers } from "@/hooks/admin.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Users,
  CircleDollarSign,
  TrendingUp,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { EventStatus, PaymentStatus } from "@/types/enums";
import { IEvent } from "@/types/event.types";
import { IPayment } from "@/types/payment.types";

// ─── Stat Card ───────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  iconClassName?: string;
  iconBg?: string;
  loading?: boolean;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconClassName = "text-foreground",
  iconBg = "bg-muted",
  loading,
}: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-5 flex items-start justify-between gap-4">
      <div className="space-y-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <>
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-3 w-32 mt-1" />
          </>
        ) : (
          <>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {sub && (
              <p className="text-xs text-muted-foreground">{sub}</p>
            )}
          </>
        )}
      </div>
      <div className={`rounded-md p-2.5 shrink-0 ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Recent Events Table ─────────────────────────────────────

function RecentEvents({ loading, events }: { loading: boolean; events: IEvent[] }) {
  const statusColor: Record<EventStatus, string> = {
    PUBLISHED: "text-emerald-600",
    DRAFT: "text-zinc-400",
    CANCELLED: "text-red-500",
    COMPLETED: "text-blue-500",
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <SectionHeader title="Recent Events" sub="Latest 5 events on the platform" />
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="divide-y">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))
          : events.length === 0
          ? (
            <p className="px-5 py-6 text-sm text-muted-foreground text-center">
              No events yet.
            </p>
          )
          : events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between px-5 py-3 gap-4 hover:bg-muted/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}
                    {event.feeType === "FREE" ? "Free" : `${event.currency} ${parseFloat(event.registrationFee).toLocaleString()}`}
                  </p>
                </div>
                <span className={`text-xs font-medium shrink-0 ${statusColor[event.status]}`}>
                  {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}

// ─── Recent Payments Table ───────────────────────────────────

function RecentPayments({ loading, payments }: { loading: boolean; payments: IPayment[] }) {
  const statusIcon: Record<PaymentStatus, React.ReactNode> = {
    PAID: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    UNPAID: <Clock className="h-4 w-4 text-amber-500" />,
    FAILED: <XCircle className="h-4 w-4 text-red-500" />,
    CANCELLED: <XCircle className="h-4 w-4 text-zinc-400" />,
    REFUNDED: <TrendingUp className="h-4 w-4 text-blue-500" />,
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <SectionHeader title="Recent Payments" sub="Latest 5 transactions" />
        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="divide-y">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))
          : payments.length === 0
          ? (
            <p className="px-5 py-6 text-sm text-muted-foreground text-center">
              No payments yet.
            </p>
          )
          : payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between px-5 py-3 gap-4 hover:bg-muted/40 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {payment.currency}{" "}
                    {parseFloat(payment.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {payment.user.name} · {payment.event.title}
                  </p>
                </div>
                <div className="shrink-0" title={payment.status}>
                  {statusIcon[payment.status]}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();
  const { data: eventsData, isLoading: eventsLoading } = useAdminEvents({
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { data: paymentsData, isLoading: paymentsLoading } = useAdminPayments();
  const { data: usersData, isLoading: usersLoading } = useUsers({ page: 1, limit: 1 });

    const recentEvents = Array.isArray(eventsData?.data) ? eventsData.data : [];
  const allPayments: IPayment[] = (paymentsData ?? []) as IPayment[];
  const recentPayments = allPayments.slice(0, 5);

  // ── Derived stats from live data ──
  const totalRevenue = allPayments
    .filter((p) => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    .toLocaleString("en-US", { minimumFractionDigits: 2 });

  const pendingPayments = allPayments.filter(
    (p) => p.status === PaymentStatus.UNPAID
  ).length;

  const totalUsers = (usersData?.meta as { total?: number })?.total ?? 0;
  const totalEvents = (eventsData?.meta as { total?: number })?.total ?? 0;

  const publishedEvents = recentEvents.filter(
    (e) => e.status === EventStatus.PUBLISHED
  ).length;

  const isLoading = statsLoading || eventsLoading || paymentsLoading || usersLoading;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform overview at a glance.
        </p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? totalUsers}
          sub="Registered accounts"
          icon={Users}
          iconClassName="text-blue-600"
          iconBg="bg-blue-50"
          loading={isLoading}
        />
        <StatCard
          label="Total Events"
          value={stats?.totalEvents ?? totalEvents}
          sub={`${publishedEvents} published recently`}
          icon={CalendarDays}
          iconClassName="text-violet-600"
          iconBg="bg-violet-50"
          loading={isLoading}
        />
        <StatCard
          label="Total Revenue"
          value={`BDT ${stats?.totalRevenue ?? totalRevenue}`}
          sub="From successful payments"
          icon={CircleDollarSign}
          iconClassName="text-emerald-600"
          iconBg="bg-emerald-50"
          loading={isLoading}
        />
        <StatCard
          label="Pending Payments"
          value={stats?.pendingParticipants ?? pendingPayments}
          sub="Awaiting completion"
          icon={Clock}
          iconClassName="text-amber-600"
          iconBg="bg-amber-50"
          loading={isLoading}
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Successful Payments"
          value={allPayments.filter((p) => p.status === PaymentStatus.PAID).length}
          sub="Completed transactions"
          icon={CheckCircle2}
          iconClassName="text-emerald-600"
          iconBg="bg-emerald-50"
          loading={paymentsLoading}
        />
        <StatCard
          label="Failed Payments"
          value={allPayments.filter((p) => p.status === PaymentStatus.FAILED).length}
          sub="Requires attention"
          icon={XCircle}
          iconClassName="text-red-500"
          iconBg="bg-red-50"
          loading={paymentsLoading}
        />
        <StatCard
          label="Active Events"
          value={stats?.activeEvents ?? "—"}
          sub="Currently published"
          icon={Star}
          iconClassName="text-amber-500"
          iconBg="bg-amber-50"
          loading={statsLoading}
        />
      </div>

      {/* Recent data — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEvents loading={eventsLoading} events={recentEvents} />
        <RecentPayments loading={paymentsLoading} payments={recentPayments} />
      </div>
    </div>
  );
}