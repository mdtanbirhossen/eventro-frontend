"use client";

import { PaymentStatus } from "@/types/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  CalendarDays,
  MapPin,
  Download,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { IPaymentDetail } from "@/types/paymentPages.types";

// ─── Status config ─────────────────────────────────────────────

const statusConfig: Record<
  PaymentStatus,
  {
    label: string;
    icon: React.ElementType;
    badgeClass: string;
    bgClass: string;
  }
> = {
  PAID: {
    label: "Payment Successful",
    icon: CheckCircle2,
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bgClass: "bg-emerald-50",
  },
  UNPAID: {
    label: "Payment Pending",
    icon: Clock,
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    bgClass: "bg-amber-50",
  },
  FAILED: {
    label: "Payment Failed",
    icon: XCircle,
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    bgClass: "bg-red-50",
  },
  CANCELLED: {
    label: "Payment Cancelled",
    icon: XCircle,
    badgeClass: "bg-zinc-100 text-zinc-600 border-zinc-200",
    bgClass: "bg-zinc-50",
  },
  REFUNDED: {
    label: "Payment Refunded",
    icon: RefreshCw,
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    bgClass: "bg-blue-50",
  },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface PaymentInvoiceProps {
  payment: IPaymentDetail;
  /** Show print/download button */
  showActions?: boolean;
}

export default function PaymentInvoice({
  payment,
  showActions = true,
}: PaymentInvoiceProps) {
  const config = statusConfig[payment.status];
  const Icon = config.icon;

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Invoice No.",
      value: (
        <span className="font-mono text-xs break-all">{payment.id}</span>
      ),
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
      label: "Status",
      value: (
        <Badge
          variant="outline"
          className={`text-xs font-medium gap-1 ${config.badgeClass}`}
        >
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      ),
    },
    {
      label: "Amount",
      value: (
        <span className="text-lg font-bold">
          {payment.currency}{" "}
          {parseFloat(payment.amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      label: "Payment Method",
      value: (
        <span className="flex items-center gap-1.5 text-sm">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          SSLCommerz
        </span>
      ),
    },
    {
      label: "Paid At",
      value: formatDate(payment.paidAt),
    },
    {
      label: "Invoice Date",
      value: formatDate(payment.createdAt),
    },
  ];

  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm max-w-xl w-full mx-auto">
      {/* Header */}
      <div className={`px-8 py-6 ${config.bgClass}`}>
        <div className="flex items-center gap-3">
          <div
            className={`rounded-full p-3 ${
              payment.status === PaymentStatus.PAID
                ? "bg-emerald-500"
                : payment.status === PaymentStatus.FAILED ||
                  payment.status === PaymentStatus.CANCELLED
                ? "bg-red-500"
                : "bg-amber-500"
            }`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{config.label}</h2>
            <p className="text-sm text-muted-foreground">
              Payment Invoice · Eventro
            </p>
          </div>
        </div>
      </div>

      {/* Event info */}
      <div className="px-8 py-5 border-b bg-muted/30 flex gap-4">
        {payment.event.banner && (
          <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
            <img
              src={payment.event.banner}
              alt={payment.event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 space-y-1">
          <p className="font-semibold leading-snug truncate">
            {payment.event.title}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {new Date(payment.event.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · {payment.event.time}
          </p>
          {payment.event.venue && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {payment.event.venue}
            </p>
          )}
        </div>
      </div>

      {/* Invoice rows */}
      <div className="px-8 py-5 space-y-0">
        {rows.map((row, i) => (
          <div key={i}>
            <div className="flex items-start justify-between gap-4 py-3">
              <span className="text-sm text-muted-foreground shrink-0 w-36">
                {row.label}
              </span>
              <span className="text-sm text-right break-all">{row.value}</span>
            </div>
            {i < rows.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {/* Billed to */}
      <div className="px-8 py-4 border-t bg-muted/20">
        <p className="text-xs text-muted-foreground mb-1">Billed to</p>
        <p className="text-sm font-medium">{payment.user.name}</p>
        <p className="text-xs text-muted-foreground">{payment.user.email}</p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-8 py-5 border-t flex flex-col sm:flex-row gap-3">
          {payment.status === PaymentStatus.PAID && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 flex-1"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Download / Print
            </Button>
          )}
          <Button asChild size="sm" className="gap-2 flex-1">
            <Link href={`/events/${payment.event.slug}`}>
              View Event
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-2 flex-1">
            <Link href="/dashboard/payments">My Payments</Link>
          </Button>
        </div>
      )}
    </div>
  );
}