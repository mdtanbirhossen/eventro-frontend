import { InvitationStatus } from "./enums";
import { IEvent } from "./event.types";
import { IPayment } from "./payment.types";
import { IUser } from "./user.interface";

export interface IInvitation {
  id: string;
  status: InvitationStatus;
  message: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  event: Pick<IEvent, "id" | "title" | "slug" | "banner">;
  invitedById: string;
  invitedBy: Pick<IUser, "id" | "name" | "email" | "image">;
  invitedUserId: string;
  invitedUser: Pick<IUser, "id" | "name" | "email" | "image">;
  paymentId: string | null;
  payment: IPayment | null;
}
 