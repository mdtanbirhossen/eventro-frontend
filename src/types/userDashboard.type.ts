import {
  EventStatus,
  EventVisibility,
  EventFeeType,
  ParticipantStatus,
  InvitationStatus,
  PaymentStatus,
  PaymentProvider,
} from "@/types/enums";



// ─── Minimal nested shapes ───────────────────────────────────

export interface IEventOwner {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface IEventCategory {
  id: string;
  name: string;
  description: string | null;
}

// ─── My Created Events ───────────────────────────────────────

/** Shape of each event returned by GET /events/me/events */
export interface IMyEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  endDate: string | null;
  venue: string | null;
  eventLink: string | null;
  banner: string | null;
  visibility: EventVisibility;
  feeType: EventFeeType;
  registrationFee: string; // Decimal → string
  currency: string;
  status: EventStatus;
  isFeatured: boolean;
  maxCapacity: number | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  categoryId: string | null;
  category: IEventCategory | null;
  // participant count may come from backend
  _count?: {
    participants: number;
  };
}

/** Query params for GET /events/me/events */
export interface IMyEventsQueryParams {
  page?: number;
  limit?: number;
  status?: EventStatus;
}

// ─── My Joined Events ────────────────────────────────────────

/** Shape of each participation returned by GET /events/me/joined */
export interface IMyJoinedEvent {
  id: string; // EventParticipant id
  status: ParticipantStatus;
  joinedAt: string | null;
  bannedAt: string | null;
  banReason: string | null;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  event: IMyEvent;
  paymentId: string | null;
  payment: IMyPayment | null;
}

// ─── My Invitations ──────────────────────────────────────────

/** Shape of each invitation returned by GET /events/invitations/me */
export interface IMyInvitation {
  id: string;
  status: InvitationStatus;
  message: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  event: Pick<IMyEvent, "id" | "title" | "slug" | "banner" | "date" | "time" | "venue" | "feeType" | "registrationFee" | "currency" | "visibility">;
  invitedById: string;
  invitedBy: IEventOwner;
  invitedUserId: string;
  paymentId: string | null;
  payment: IMyPayment | null;
}

/** Payload for PATCH /events/invitations/:invitationId */
export interface IRespondInvitationPayload {
  action: "ACCEPTED" | "DECLINED";
}

// ─── My Payments ─────────────────────────────────────────────

/** Shape of each payment returned by GET /payment/my */
export interface IMyPayment {
  id: string;
  amount: string; // Decimal → string
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  transactionId: string | null;
  paymentUrl: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  event: Pick<IMyEvent, "id" | "title" | "slug" | "banner" | "date" | "venue">;
}

/** Payload for POST /payment/create-session */
export interface ICreatePaymentSessionPayload {
  eventId: string;
}

/** Response from POST /payment/create-session */
export interface ICreatePaymentSessionResponse {
  paymentUrl: string;
  transactionId: string;
}