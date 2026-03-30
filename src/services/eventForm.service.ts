"use server";
 
import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IEventCategory } from "@/types/eventCategory.types";
import {
  ICreateEventPayload,
  IUpdateEventPayload,
} from "@/types/eventForm.types";
import { IMyEvent } from "@/types/userDashboard.type";


/** POST /events */
export async function createEventAction(
  payload: ICreateEventPayload
): Promise<ApiResponse<IMyEvent> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<IMyEvent>("/events", payload);
    return response;
  } catch (error) {
    return handleError(error, "Failed to create event.");
  }
}
 
// ============================================================
// Get Single Event (for pre-filling edit form)
// ============================================================
 
/** GET /events/:eventId */
export async function getEventByIdAction(
  eventId: string
): Promise<ApiResponse<IMyEvent> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IMyEvent>(`/events/${eventId}`);
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch event.");
  }
}
 
// ============================================================
// Update Event
// ============================================================
 
/** PUT /events/:eventId */
export async function updateEventAction(
  eventId: string,
  payload: IUpdateEventPayload
): Promise<ApiResponse<IMyEvent> | ApiErrorResponse> {
  try {
    const response = await httpClient.put<IMyEvent>(
      `/events/${eventId}`,
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to update event.");
  }
}
 
// ============================================================
// Upload Banner Image
// ============================================================
 
/** POST /upload/ — multipart/form-data */
export async function uploadBannerAction(
  formData: FormData
): Promise<ApiResponse<{ url: string }> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<{ url: string }>(
      "/upload/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to upload banner.");
  }
}
 
/** DELETE /upload/delete-image */
export async function deleteBannerAction(
  urls: string[]
): Promise<ApiResponse<null> | ApiErrorResponse> {
  try {
    const response = await httpClient.delete<null>("/upload/delete-image", {
      params: { url: urls },
    });
    return response;
  } catch (error) {
    return handleError(error, "Failed to delete banner.");
  }
}
 
// ============================================================
// Get Categories (for the category dropdown)
// ============================================================
 
/** GET /events/categories */
export async function getEventCategoriesAction(): Promise<
  ApiResponse<IEventCategory[]> | ApiErrorResponse
> {
  try {
    const response = await httpClient.get<IEventCategory[]>(
      "/event-categories"
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch categories.");
  }
}