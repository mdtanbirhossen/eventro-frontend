import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PaymentProvider, PaymentStatus } from "@/types/enums";
import { IPayment } from "@/types/payment.types";
import { CreditCard } from "lucide-react";

export function formatCurrency(amount: string, currency: string) {
    return `${currency} ${parseFloat(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
    })}`;
}

export function formatDate(date: string | null) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// ─── Status Badge ────────────────────────────────────────────

export const statusConfig: Record<
    PaymentStatus,
    {
        label: string;
        className: string;
    }
> = {
    PAID: {
        label: "Paid",
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    UNPAID: {
        label: "Unpaid",
        className: "bg-amber-100 text-amber-800 border-amber-200",
    },
    CANCELLED: {
        label: "Cancelled",
        className: "bg-zinc-100 text-zinc-600 border-zinc-200",
    },
    REFUNDED: {
        label: "Refunded",
        className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    FAILED: {
        label: "Failed",
        className: "bg-red-100 text-red-800 border-red-200",
    },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    const { label, className } = statusConfig[status];
    return (
        <Badge
            variant="outline"
            className={`text-xs font-medium ${className}`}
        >
            {label}
        </Badge>
    );
}

// ─── Provider Badge ──────────────────────────────────────────

export function ProviderBadge({ provider }: { provider: PaymentProvider }) {
    return (
        <Badge variant="secondary" className="text-xs gap-1">
            <CreditCard className="h-3 w-3" />
            {provider === PaymentProvider.SSLCOMMERZ ? "SSLCommerz" : "Stripe"}
        </Badge>
    );
}


export default function PaymentDetailDialog({
    open,
    onOpenChange,
    payment,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    payment: IPayment | null;
}) {
    if (!payment) return null;

    const rows: { label: string; value: React.ReactNode }[] = [
        { label: "Payment ID", value: <span className="font-mono text-xs">{payment.id}</span> },
        { label: "Transaction ID", value: payment.transactionId ? <span className="font-mono text-xs">{payment.transactionId}</span> : "—" },
        { label: "Amount", value: <span className="font-semibold">{formatCurrency(payment.amount, payment.currency)}</span> },
        { label: "Status", value: <PaymentStatusBadge status={payment.status} /> },
        { label: "Provider", value: <ProviderBadge provider={payment.provider} /> },
        { label: "User", value: `${payment.user.name} (${payment.user.email})` },
        { label: "Event", value: payment.event.title },
        { label: "Paid At", value: formatDate(payment.paidAt) },
        { label: "Created At", value: formatDate(payment.createdAt) },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Payment Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 pt-2">
                    {rows.map((row, i) => (
                        <div key={i}>
                            <div className="flex items-start justify-between gap-4 py-1.5">
                                <span className="text-sm text-muted-foreground shrink-0 w-32">
                                    {row.label}
                                </span>
                                <span className="text-sm text-right break-all">{row.value}</span>
                            </div>
                            {i < rows.length - 1 && <Separator />}
                        </div>
                    ))}

                    {/* Raw gateway response */}
                    {payment.gatewayResponse && (
                        <div className="pt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">
                                Gateway Response
                            </p>
                            <pre className="rounded-md bg-muted p-3 text-xs overflow-auto max-h-40">
                                {JSON.stringify(payment.gatewayResponse, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
