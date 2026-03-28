import { IEvent } from "./event.types";
import { IUser } from "./user.interface";

export interface IReview {
  id: string;
  rating: number;           // 1–5
  comment: string | null;
  isEdited: boolean;
  editedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  event: Pick<IEvent, "id" | "title" | "slug">;
  userId: string;
  user: Pick<IUser, "id" | "name" | "email" | "image">;
}