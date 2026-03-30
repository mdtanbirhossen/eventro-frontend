"use client";

import { useState } from "react";
import { useMyPayments } from "@/hooks/userDashboard.hooks";
import { IMyPayment } from "@/types/userDashboard.type";
import { PaymentStatus, PaymentProvider } from "@/types/enums";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/shared/Pagination/Pagination";
import {
  CircleDollarSign,
  Eye,
  CreditCard,
  CalendarDays,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

// ─── Helpers ─────────────────────────────────────────────────

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  PAID: {
    label: "Paid",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  UNPAID: {
    label: "Unpaid",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
    icon: XCircle,
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    icon: RefreshCw,
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, className, icon: Icon } = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium gap-1 ${className}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

function formatCurrency(amount: string, currency: string) {
  return `${currency} ${parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
}

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Skeleton ────────────────────────────────────────────────

function PaymentCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-md shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-5 w-24 ml-auto" />
        <Skeleton className="h-4 w-16 ml-auto" />
      </div>
    </div>
  );
}

// ─── Payment Detail Dialog ───────────────────────────────────

function PaymentDetailDialog({
  open,
  onOpenChange,
  payment,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  payment: IMyPayment | null;
}) {
  if (!payment) return null;

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Payment ID",
      value: <span className="font-mono text-xs break-all">{payment.id}</span>,
    },
    {
      label: "Transaction ID",
      value: payment.transactionId ? (
        <span className="font-mono text-xs">{payment.transactionId}</span>
      ) : (
        "—"
      ),
    },
    {
      label: "Amount",
      value: (
        <span className="font-semibold">
          {formatCurrency(payment.amount, payment.currency)}
        </span>
      ),
    },
    { label: "Status", value: <PaymentStatusBadge status={payment.status} /> },
    {
      label: "Provider",
      value: (
        <span className="inline-flex items-center gap-1 text-xs">
          <CreditCard className="h-3.5 w-3.5" />
          {payment.provider === PaymentProvider.SSLCOMMERZ
            ? "SSLCommerz"
            : "Stripe"}
        </span>
      ),
    },
    { label: "Event", value: payment.event.title },
    { label: "Paid At", value: formatDate(payment.paidAt) },
    { label: "Created At", value: formatDate(payment.createdAt) },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Payment Receipt
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1 pt-2">
          {rows.map((row, i) => (
            <div key={i}>
              <div className="flex items-start justify-between gap-4 py-2">
                <span className="text-sm text-muted-foreground shrink-0 w-28">
                  {row.label}
                </span>
                <span className="text-sm text-right break-all">
                  {row.value}
                </span>
              </div>
              {i < rows.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Payment Card ─────────────────────────────────────────────

function PaymentCard({
  payment,
  onViewDetail,
}: {
  payment: IMyPayment;
  onViewDetail: (p: IMyPayment) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
      {/* Event banner thumbnail */}
      <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted">
        {payment.event.banner ? (
          <img
            src={payment.event.banner}
            alt={payment.event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Tag className="h-5 w-5 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/events/${payment.event.slug}`}
          className="text-sm font-semibold leading-none truncate hover:underline block"
        >
          {payment.event.title}
        </Link>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          {payment.event.date && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(payment.event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          <span className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            {payment.provider === PaymentProvider.SSLCOMMERZ
              ? "SSLCommerz"
              : "Stripe"}
          </span>
        </div>
      </div>

      {/* Amount + status + action */}
      <div className="text-right shrink-0 space-y-1.5">
        <p className="text-sm font-bold tabular-nums">
          {formatCurrency(payment.amount, payment.currency)}
        </p>
        <PaymentStatusBadge status={payment.status} />
        <div className="pt-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onViewDetail(payment)}
            title="View receipt"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Summary Cards ───────────────────────────────────────────

function SummaryCards({ payments }: { payments: IMyPayment[] }) {
  const paid = payments.filter((p) => p.status === PaymentStatus.PAID);
  const totalSpent = paid
    .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    .toLocaleString("en-US", { minimumFractionDigits: 2 });

  const cards = [
    {
      label: "Total Spent",
      value: `BDT ${totalSpent}`,
      icon: CircleDollarSign,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
    {
      label: "Successful",
      value: paid.length,
      icon: CheckCircle2,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Pending",
      value: payments.filter((p) => p.status === PaymentStatus.UNPAID).length,
      icon: Clock,
      bg: "bg-amber-50",
      color: "text-amber-600",
    },
    {
      label: "Failed",
      value: payments.filter((p) => p.status === PaymentStatus.FAILED).length,
      icon: XCircle,
      bg: "bg-red-50",
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border bg-card p-4 flex items-center gap-3"
        >
          <div className={`rounded-md p-2 ${c.bg}`}>
            <c.icon className={`h-4 w-4 ${c.color}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="text-base font-bold leading-tight">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

const PAGE_SIZE = 8;

export default function MyPayments() {
  const [statusFilter, setStatusFilter] = useState<"ALL" | PaymentStatus>(
    "ALL"
  );
  const [page, setPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<IMyPayment | null>(
    null
  );

  const { data, isLoading, isError } = useMyPayments();
  const payments = (data ?? []) as IMyPayment[];

  const filtered =
    statusFilter === "ALL"
      ? payments
      : payments.filter((p) => p.status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openDetail = (payment: IMyPayment) => {
    setSelectedPayment(payment);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your transaction history for paid events.
        </p>
      </div>

      {/* Summary */}
      {!isLoading && !isError && <SummaryCards payments={payments} />}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as "ALL" | PaymentStatus);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.values(PaymentStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {statusConfig[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!isLoading && (
          <p className="text-sm text-muted-foreground">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <PaymentCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border bg-card py-16 text-center text-muted-foreground">
          Failed to load payments. Please try again.
        </div>
      ) : paginated.length === 0 ? (
        <div className="rounded-lg border bg-card py-16 text-center space-y-2">
          <CircleDollarSign className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-sm text-muted-foreground">
            {statusFilter !== "ALL"
              ? `No ${statusConfig[statusFilter].label.toLowerCase()} payments.`
              : "You have no payment history yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onViewDetail={openDetail}
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
          itemLabel="payments"
        />
      )}

      {/* Detail dialog */}
      <PaymentDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        payment={selectedPayment}
      />
    </div>
  );
}