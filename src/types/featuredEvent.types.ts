import { IEvent } from "./event.types";

export interface IFeaturedEvent {
  id: string;
  createdAt: string;
  updatedAt: string;
  eventId: string;
  event: IEvent;
}