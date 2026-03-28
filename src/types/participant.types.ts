import { ParticipantStatus } from "./enums";
import { IPayment } from "./payment.types";
import { IUser } from "./user.interface";

export interface IEventParticipant {
  id: string;
  status: ParticipantStatus;
  joinedAt: string | null;
  bannedAt: string | null;
  banReason: string | null;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  userId: string;
  user: Pick<IUser, "id" | "name" | "email" | "image">;
  paymentId: string | null;
  payment: IPayment | null;
}
 
/** PATCH /events/:eventId/participants/:userId/ban */
export interface IBanParticipantPayload {
  banReason: string;
}
 