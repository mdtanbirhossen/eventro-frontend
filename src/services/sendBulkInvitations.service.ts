"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  ISendBulkInvitationsPayload,
  ISendBulkInvitationsResponse,
  IUserForInvitation,
  ISearchUsersParams,
} from "@/types/sendBulkInvitations.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(error: any, fallback: string): ApiErrorResponse {
  const message =
    error?.response?.data?.message || error?.message || fallback;
  return { success: false, message };
}

/**
 * POST /events/:eventId/invite
 * Send invitation(s) to user(s)
 */
// TODO: Adjust endpoint and payload as per your actual API design
export async function sendBulkInvitationsAction(
  eventId: string,
  payload: ISendBulkInvitationsPayload
): Promise<ApiResponse<ISendBulkInvitationsResponse> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<ISendBulkInvitationsResponse>(
      `/events/${eventId}/invite`,
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to send invitations.");
  }
}

/**
 * GET /api/users/search
 * Search for users to invite
 * Note: You may need to adjust this endpoint based on your actual API
 */
export async function searchUsersAction(
  params?: ISearchUsersParams
): Promise<ApiResponse<IUserForInvitation[]> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IUserForInvitation[]>(
      "/users",
      {
        params: params as Record<string, unknown>,
      }
    );
    console.log("Search Users Response:", response);
    return response;
  } catch (error) {
    return handleError(error, "Failed to search users.");
  }
}

/**
 * Get list of already invited users for an event
 * GET /events/:eventId/invitations
 * Note: Adjust endpoint if needed
 */
export async function getEventInvitationsAction(
  eventId: string
): Promise<ApiResponse<Array<{ invitedUserId: string }>> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<Array<{ invitedUserId: string }>>(
      `/events/${eventId}/invitations`
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch invitations.");
  }
}