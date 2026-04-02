"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCreatePaymentSession } from "@/hooks/userDashboard.hooks";
import { usePaymentByTransactionId } from "@/hooks/paymentPage.hooks";
import PaymentInvoice from "@/components/modules/Admin/Payment/Paymentinvoice";
import { useAuth } from "@/context/AuthContext";

function PageSkeleton() {
    return (
        <div className="max-w-xl mx-auto space-y-4 px-4 py-12">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
    );
}

export default function PaymentFailedPage() {
    const { user } = useAuth()
    const isAdmin = user?.role === "ADMIN";
    
    const searchParams = useSearchParams();
    const tran_id = searchParams.get("tran_id") ?? "";

    const { data: payment, isLoading, isError } = usePaymentByTransactionId(tran_id);
    const createPaymentSession = useCreatePaymentSession();

    // Determine if this is a cancel or a hard failure
    const isCancelled =
        searchParams.get("status")?.toLowerCase() === "cancelled" ||
        payment?.status === "CANCELLED";

    const handleRetry = () => {
        if (!payment?.eventId) return;
        createPaymentSession.mutate({ eventId: payment.eventId });
    };

    if (!tran_id) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
                <p className="text-muted-foreground text-sm">
                    No transaction ID found.
                </p>
                <Button asChild variant="outline">
                    <Link href="/events">Browse Events</Link>
                </Button>
            </div>
        );
    }

    if (isLoading) return <PageSkeleton />;

    return (
        <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
            {/* Status banner */}
            <div
                className={`rounded-2xl border p-6 text-center space-y-2 ${isCancelled
                    ? "bg-zinc-50 border-zinc-200"
                    : "bg-red-50 border-red-200"
                    }`}
            >
                <XCircle
                    className={`h-12 w-12 mx-auto ${isCancelled ? "text-zinc-400" : "text-red-500"
                        }`}
                />
                <h1
                    className={`text-xl font-bold ${isCancelled ? "text-zinc-700" : "text-red-800"
                        }`}
                >
                    {isCancelled ? "Payment Cancelled" : "Payment Failed"}
                </h1>
                <p
                    className={`text-sm ${isCancelled ? "text-zinc-600" : "text-red-700"
                        }`}
                >
                    {isCancelled
                        ? "You cancelled the payment. No charge was made."
                        : "Something went wrong with your payment. Please try again."}
                </p>
            </div>

            {/* Invoice (if we have payment details) */}
            {!isError && payment && (
                <PaymentInvoice payment={payment} showActions={false} />
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
                {/* Retry payment — only if we have the eventId */}
                {payment?.eventId && (
                    <Button
                        className="gap-2 w-full"
                        onClick={handleRetry}
                        disabled={createPaymentSession.isPending}
                    >
                        <RotateCcw className="h-4 w-4" />
                        {createPaymentSession.isPending
                            ? "Redirecting to payment…"
                            : "Try Again"}
                    </Button>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/events">
                            <ArrowLeft className="h-4 w-4" />
                            Browse Events
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={`/${isAdmin ? "admin" : "dashboard"}/my-payments`}>My Payments</Link>
                    </Button>
                </div>
            </div>

            {/* Help note */}
            <p className="text-xs text-center text-muted-foreground">
                If you were charged but see this page, please contact support with
                transaction ID:{" "}
                <span className="font-mono font-medium">{tran_id}</span>
            </p>
        </div>
    );
}