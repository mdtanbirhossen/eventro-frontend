// ─── src/types/payment-pages.types.ts ───────────────────────

import { PaymentStatus, PaymentProvider } from "@/types/enums";

/** SSLCommerz redirects back with these query params */
export interface ISSLCommerzCallbackParams {
  tran_id?: string;
  val_id?: string;
  amount?: string;
  card_type?: string;
  store_amount?: string;
  bank_tran_id?: string;
  status?: "VALID" | "VALIDATED" | "INVALID" | "FAILED" | string;
  tran_date?: string;
  currency?: string;
  card_issuer?: string;
  card_brand?: string;
  card_issuer_country?: string;
  card_no?: string;
  currency_amount?: string;
  currency_rate?: string;
  base_fair?: string;
  value_a?: string; // custom field — we store eventId here
  value_b?: string; // custom field — we store userId here
}

/** Full payment record returned by GET /payment/:id or GET /payment/my */
export interface IPaymentDetail {
  id: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  transactionId: string | null;
  paymentUrl: string | null;
  gatewayResponse: Record<string, unknown> | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  eventId: string;
  event: {
    id: string;
    title: string;
    slug: string;
    banner: string | null;
    date: string;
    time: string;
    venue: string | null;
    eventLink: string | null;
  };
}