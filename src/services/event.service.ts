
"use server";
 

import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IAdminEventListResponse, IAdminEventQueryParams } from "@/types/event.types";
import { IFeaturedEvent } from "@/types/featuredEvent.types";


/** GET /events/admin/all */
export async function getAdminAllEvents(
  params?: IAdminEventQueryParams
): Promise<ApiResponse<IAdminEventListResponse> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IAdminEventListResponse>(
      "/events/admin/all",
      { params: params as Record<string, unknown> }
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch events.");
  }
}
 
/** PATCH /events/admin/:eventId/feature  — toggle featured */
export async function setFeaturedEvent(
  eventId: string
): Promise<ApiResponse<IFeaturedEvent> | ApiErrorResponse> {
  try {
    const response = await httpClient.patch<IFeaturedEvent>(
      `/events/admin/${eventId}/feature`,
      {}
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to set featured event.");
  }
}
 
/** DELETE /events/admin/:eventId  — force delete */
export async function adminForceDeleteEvent(
  eventId: string
): Promise<ApiResponse<null> | ApiErrorResponse> {
  try {
    const response = await httpClient.delete<null>(
      `/events/admin/${eventId}`
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to delete event.");
  }
}
