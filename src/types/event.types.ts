import { PaginationMeta } from "./api.types";
import { EventFeeType, EventStatus, EventVisibility } from "./enums";
import { IEventCategory } from "./eventCategory.types";
import { IUser } from "./user.interface";

export interface IEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;           // ISO date string
  time: string;           // e.g. "18:00"
  endDate: string | null;
  venue: string | null;
  eventLink: string | null;
  banner: string | null;
  visibility: EventVisibility;
  feeType: EventFeeType;
  registrationFee: string; // Decimal comes back as string from JSON
  currency: string;
  status: EventStatus;
  isFeatured: boolean;
  maxCapacity: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: Pick<IUser, "id" | "name" | "email" | "image">;
  categoryId: string | null;
  category: IEventCategory | null;
}
 
/** Query params for GET /events/admin/all */
export interface IAdminEventQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "date" | "createdAt" | "title" | "registrationFee";
  sortOrder?: "asc" | "desc";
  search?: string;
  visibility?: EventVisibility;
  feeType?: EventFeeType;
  status?: EventStatus;
  categoryId?: string;
}
 
export interface IAdminEventListResponse {
  data: IEvent[];
  meta: PaginationMeta;
}