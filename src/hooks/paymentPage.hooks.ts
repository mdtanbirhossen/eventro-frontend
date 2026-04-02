"use client";

import { useQuery } from "@tanstack/react-query";

import { PaymentStatus } from "@/types/enums";
import { getMyPaymentsForVerificationAction, getPaymentByTransactionIdAction } from "@/services/paymentPage.service";
import { IPaymentDetail } from "@/types/paymentPages.types";

export function usePaymentByTransactionId(tran_id: string) {
  return useQuery({
    queryKey: ["payment-by-tran", tran_id],
    queryFn: async () => {
      // Try direct endpoint first
      const res = await getPaymentByTransactionIdAction(tran_id);
      console.log(res)
      if (res.success) return res.data as IPaymentDetail;

      // Fallback: fetch all and find by transactionId
      const allRes = await getMyPaymentsForVerificationAction();
      if (!allRes.success) throw new Error(allRes.message);

      const payments = (allRes.data ?? []) as IPaymentDetail[];
      const found = payments.find((p) => p.transactionId === tran_id);
      if (!found) throw new Error("Payment not found.");
      return found;
    },
    enabled: !!tran_id,
    // retry once — SSLCommerz callback may arrive before DB is updated
    retry: 2,
    retryDelay: 1500,
    staleTime: 0,
  });
}

// Derived helper for status check
export function usePaymentStatus(tran_id: string) {
  const query = usePaymentByTransactionId(tran_id);
  return {
    ...query,
    isPaid: query.data?.status === PaymentStatus.PAID,
    isFailed:
      query.data?.status === PaymentStatus.FAILED ||
      query.data?.status === PaymentStatus.CANCELLED,
  };
}