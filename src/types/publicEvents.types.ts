import {
  EventStatus,
  EventVisibility,
  EventFeeType,
  ParticipantStatus,
} from "@/types/enums";

// ─── Shared ──────────────────────────────────────────────────


// ─── Category ────────────────────────────────────────────────

export interface IPublicCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Event Owner ─────────────────────────────────────────────

export interface IPublicEventOwner {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

// ─── Public Event ────────────────────────────────────────────

/** Shape returned by GET /events and GET /events/:id */
export interface IPublicEvent {
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
  registrationFee: string;
  currency: string;
  status: EventStatus;
  isFeatured: boolean;
  maxCapacity: number | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: IPublicEventOwner;
  categoryId: string | null;
  category: IPublicCategory | null;
  // participant + review counts if backend sends them
  _count?: {
    participants: number;
    reviews: number;
  };
}

// ─── Query params for GET /events ────────────────────────────

export interface IPublicEventsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  visibility?: EventVisibility;
  feeType?: EventFeeType;
  status?: EventStatus;
  categoryId?: string;
  sortBy?: "date" | "createdAt" | "title" | "registrationFee";
  sortOrder?: "asc" | "desc";
}

// ─── Review ──────────────────────────────────────────────────

export interface IPublicReview {
  id: string;
  rating: number; // 1–5
  comment: string | null;
  isEdited: boolean;
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: Pick<IPublicEventOwner, "id" | "name" | "image">;
}

// ─── Create Review payload ────────────────────────────────────

export interface ICreateReviewPayload {
  eventId: string;
  rating: number;
  comment?: string;
}

export interface IUpdateReviewPayload {
  rating?: number;
  comment?: string;
}

// ─── Participation ────────────────────────────────────────────

/** Shape returned after POST /events/:eventId/join */
export interface IParticipation {
  id: string;
  status: ParticipantStatus;
  joinedAt: string | null;
  createdAt: string;
  eventId: string;
  userId: string;
  paymentId: string | null;
  payment: {
    id: string;
    paymentUrl: string | null;
    status: string;
  } | null;
}

// ─── Featured Event ───────────────────────────────────────────

export interface IFeaturedEventResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  event: IPublicEvent;
}