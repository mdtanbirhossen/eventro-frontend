import { PaginationMeta } from "./api.types";
import { PaymentProvider, PaymentStatus } from "./enums";
import { IEvent } from "./event.types";
import { IUser } from "./user.interface";

export interface IPayment {
  id: string;
  amount: string;          // Decimal → string
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
  user: Pick<IUser, "id" | "name" | "email">;
  eventId: string;
  event: Pick<IEvent, "id" | "title" | "slug">;
}
 
export interface IAdminPaymentListResponse {
  data: IPayment[];
  meta: PaginationMeta;
}
 