"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import PaymentInvoice from "@/components/modules/Admin/Payment/Paymentinvoice";
import { usePaymentByTransactionId } from "@/hooks/paymentPage.hooks";
import { useAuth } from "@/context/AuthContext";

function PageSkeleton() {
  return (
    <div className="max-w-xl mx-auto space-y-4 px-4 py-12">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth()
  const isAdmin = user!.role === "ADMIN"

  // SSLCommerz sends tran_id as a query param on redirect
  const tran_id = searchParams.get("tran_id") ?? "";
  const status = searchParams.get("status") ?? "";

  const { data: payment, isLoading, isError } = usePaymentByTransactionId(tran_id);

  if (!tran_id) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-muted-foreground text-sm">
          No transaction ID found. Please check your payments dashboard.
        </p>
        <Button asChild variant="outline">
          <Link href={`/${isAdmin ? "admin" : "dashboard"}/my-payments`}>View Payments</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) return <PageSkeleton />;

  if (isError || !payment) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-muted-foreground text-sm">
          Could not load payment details. Your payment may still be processing.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Button asChild>
            <Link href={`/${isAdmin ? "admin" : "dashboard"}/my-payments`}>View Payments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Confirmation banner */}
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
        <h1 className="text-xl font-bold text-emerald-800">
          Payment Confirmed!
        </h1>
        <p className="text-sm text-emerald-700">
          You&apos;re all set. Your spot at{" "}
          <span className="font-semibold">{payment.event.title}</span> has been
          reserved.
        </p>
      </div>

      {/* Invoice */}
      <PaymentInvoice payment={payment} showActions />

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/${isAdmin ? "admin" : "dashboard"}/my-joined-events`}>
            My Joined Events <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/events">Browse More Events</Link>
        </Button>
      </div>
    </div>
  );
}