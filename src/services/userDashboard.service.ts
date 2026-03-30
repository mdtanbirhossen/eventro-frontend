"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  IMyEvent,
  IMyEventsQueryParams,
  IMyJoinedEvent,
  IMyInvitation,
  IMyPayment,
  IRespondInvitationPayload,
  ICreatePaymentSessionPayload,
  ICreatePaymentSessionResponse,
} from "@/types/userDashboard.type";

// ─── Helper ──────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(error: any, fallback: string): ApiErrorResponse {
  const message =
    error?.response?.data?.message || error?.message || fallback;
  return { success: false, message };
}

// ============================================================
// My Created Events
// ============================================================

/** GET /events/me/events */
export async function getMyEvents(
  params?: IMyEventsQueryParams
): Promise<ApiResponse<IMyEvent[]> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IMyEvent[]>("/events/me/events", {
      params: params as Record<string, unknown>,
    });
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch your events.");
  }
}

/** GET /events/me/events?status=DRAFT */
export async function getMyDraftEvents(): Promise<
  ApiResponse<IMyEvent[]> | ApiErrorResponse
> {
  try {
    const response = await httpClient.get<IMyEvent[]>("/events/me/events", {
      params: { status: "DRAFT" },
    });
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch draft events.");
  }
}

/** PUT /events/:eventId */
export async function updateMyEvent(
  eventId: string,
  payload: Partial<IMyEvent>
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

/** DELETE /events/:eventId */
export async function deleteMyEvent(
  eventId: string
): Promise<ApiResponse<null> | ApiErrorResponse> {
  try {
    const response = await httpClient.delete<null>(`/events/${eventId}`);
    return response;
  } catch (error) {
    return handleError(error, "Failed to delete event.");
  }
}

// ============================================================
// My Joined Events (Participations)
// ============================================================

/** GET /events/me/joined */
export async function getMyJoinedEvents(): Promise<
  ApiResponse<IMyJoinedEvent[]> | ApiErrorResponse
> {
  try {
    const response =
      await httpClient.get<IMyJoinedEvent[]>("/events/me/joined");
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch joined events.");
  }
}

/** POST /events/:eventId/join */
export async function joinEvent(
  eventId: string
): Promise<ApiResponse<IMyJoinedEvent> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<IMyJoinedEvent>(
      `/events/${eventId}/join`,
      {}
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to join event.");
  }
}

// ============================================================
// My Invitations
// ============================================================

/** GET /events/invitations/me */
export async function getMyInvitations(): Promise<
  ApiResponse<IMyInvitation[]> | ApiErrorResponse
> {
  try {
    const response = await httpClient.get<IMyInvitation[]>(
      "/events/invitations/me"
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch invitations.");
  }
}

/** PATCH /events/invitations/:invitationId — accept or decline */
export async function respondToInvitation(
  invitationId: string,
  payload: IRespondInvitationPayload
): Promise<ApiResponse<IMyInvitation> | ApiErrorResponse> {
  try {
    const response = await httpClient.patch<IMyInvitation>(
      `/events/invitations/${invitationId}`,
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to respond to invitation.");
  }
}

// ============================================================
// My Payments
// ============================================================

/** GET /payment/my */
export async function getMyPayments(): Promise<
  ApiResponse<IMyPayment[]> | ApiErrorResponse
> {
  try {
    const response = await httpClient.get<IMyPayment[]>("/payment/my");
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch payments.");
  }
}

/** POST /payment/create-session */
export async function createPaymentSession(
  payload: ICreatePaymentSessionPayload
): Promise<ApiResponse<ICreatePaymentSessionResponse> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<ICreatePaymentSessionResponse>(
      "/payment/create-session",
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to create payment session.");
  }
}