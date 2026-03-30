"use server";

import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  IPublicEvent,
  IPublicEventsQueryParams,
  IPublicCategory,
  IPublicReview,
  ICreateReviewPayload,
  IUpdateReviewPayload,
  IParticipation,
  IFeaturedEventResponse,
} from "@/types/publicEvents.types";

// ─── Helper ──────────────────────────────────────────────────



// ============================================================
// Events Listing
// ============================================================

/** GET /events */
export async function getPublicEventsAction(
  params?: IPublicEventsQueryParams
): Promise<ApiResponse<IPublicEvent[]> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IPublicEvent[]>("/events", {
      params: params as Record<string, unknown>,
    });
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch events.");
  }
}

// ============================================================
// Single Event
// ============================================================

/** GET /events/:eventId */
export async function getPublicEventByIdAction(
  eventId: string
): Promise<ApiResponse<IPublicEvent> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IPublicEvent>(`/events/${eventId}`);
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch event.");
  }
}

/** GET /events/:slug — by slug for public detail page */
export async function getPublicEventBySlugAction(
  slug: string
): Promise<ApiResponse<IPublicEvent> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IPublicEvent>(`/events/${slug}`);
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch event.");
  }
}

// ============================================================
// Featured Event
// ============================================================

/** GET /events/featured */
export async function getFeaturedEventAction(): Promise<
  ApiResponse<IPublicEvent> | ApiErrorResponse
> {
  try {
    const response =
      await httpClient.get<IPublicEvent>("/events/featured");
      console.log(response.data)
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch featured event.");
  }
}

// ============================================================
// Categories
// ============================================================

/** GET /events/categories */
export async function getPublicCategoriesAction(): Promise<
  ApiResponse<IPublicCategory[]> | ApiErrorResponse
> {
  try {
    const response =
      await httpClient.get<IPublicCategory[]>("/events/categories");
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch categories.");
  }
}

// ============================================================
// Join Event
// ============================================================

/** POST /events/:eventId/join */
export async function joinEventAction(
  eventId: string
): Promise<ApiResponse<IParticipation> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<IParticipation>(
      `/events/${eventId}/join`,
      {}
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to join event.");
  }
}

// ============================================================
// Reviews
// ============================================================

/** GET /events/:eventId/reviews */
export async function getEventReviewsAction(
  eventId: string
): Promise<ApiResponse<IPublicReview[]> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IPublicReview[]>(
      `/reviews/event/${eventId}`
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch reviews.");
  }
}

/** POST /events/:eventId/reviews */
export async function createReviewAction(
  payload: ICreateReviewPayload
): Promise<ApiResponse<IPublicReview> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<IPublicReview>(
      `/reviews`,
      payload
    );
    console.log("Create review response:", response);
    return response;
  } catch (error) {
    return handleError(error, "Failed to submit review.");
  }
}

/** PATCH /reviews/:reviewId */
export async function updateReviewAction(
  reviewId: string,
  payload: IUpdateReviewPayload
): Promise<ApiResponse<IPublicReview> | ApiErrorResponse> {
  try {
    const response = await httpClient.patch<IPublicReview>(
      `/reviews/${reviewId}`,
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to update review.");
  }
}

/** DELETE /reviews/:reviewId */
export async function deleteReviewAction(
  reviewId: string
): Promise<ApiResponse<null> | ApiErrorResponse> {
  try {
    const response = await httpClient.delete<null>(`/reviews/${reviewId}`);
    return response;
  } catch (error) {
    return handleError(error, "Failed to delete review.");
  }
}