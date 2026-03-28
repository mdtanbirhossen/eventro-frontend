
"use server";
 

import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IBanParticipantPayload } from "@/types/participant.types";


/** GET /events/:eventId/participants?status=... */
export async function getEventParticipants(
  eventId: string,
  status?: "PENDING" | "APPROVED" | "REJECTED" | "BANNED"
): Promise<ApiResponse<unknown> | ApiErrorResponse> {
  try {
    const response = await httpClient.get(
      `/events/${eventId}/participants`,
      { params: status ? { status } : undefined }
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch participants.");
  }
}
 
/** PATCH /events/:eventId/participants/:userId/approve */
export async function approveParticipant(
  eventId: string,
  userId: string
): Promise<ApiResponse<unknown> | ApiErrorResponse> {
  try {
    const response = await httpClient.patch(
      `/events/${eventId}/participants/${userId}/approve`,
      {}
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to approve participant.");
  }
}
 
/** PATCH /events/:eventId/participants/:userId/reject */
export async function rejectParticipant(
  eventId: string,
  userId: string
): Promise<ApiResponse<unknown> | ApiErrorResponse> {
  try {
    const response = await httpClient.patch(
      `/events/${eventId}/participants/${userId}/reject`,
      {}
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to reject participant.");
  }
}
 
/** PATCH /events/:eventId/participants/:userId/ban */
export async function banParticipant(
  eventId: string,
  userId: string,
  payload: IBanParticipantPayload
): Promise<ApiResponse<unknown> | ApiErrorResponse> {
  try {
    const response = await httpClient.patch(
      `/events/${eventId}/participants/${userId}/ban`,
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to ban participant.");
  }
}