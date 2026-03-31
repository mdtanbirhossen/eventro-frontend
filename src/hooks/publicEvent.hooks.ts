"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
    getPublicEventsAction,
    getPublicEventBySlugAction,
    getFeaturedEventAction,
    getPublicCategoriesAction,
    joinEventAction,
    getEventReviewsAction,
    createReviewAction,
    updateReviewAction,
    deleteReviewAction,
} from "@/services/publicEvents.service";

import {
    IPublicEventsQueryParams,
    IPublicEvent,
    IPublicCategory,
    IPublicReview,
    ICreateReviewPayload,
    IUpdateReviewPayload,
} from "@/types/publicEvents.types";
import { PaginationMeta } from "@/types/api.types";

// ============================================================
// Query Keys
// ============================================================

export const publicEventsQueryKeys = {
    events: (params?: IPublicEventsQueryParams) =>
        ["public-events", params] as const,
    eventBySlug: (slug: string) => ["public-event", slug] as const,
    featuredEvent: ["featured-event"] as const,
    categories: ["public-categories"] as const,
    reviews: (eventId: string) => ["event-reviews", eventId] as const,
};

// ============================================================
// Events Listing
// ============================================================

export function usePublicEvents(params?: IPublicEventsQueryParams) {
    return useQuery({
        queryKey: publicEventsQueryKeys.events(params),
        queryFn: async () => {
            const res = await getPublicEventsAction(params);
            if (!res.success) throw new Error(res.message);
            return {
                data: res.data as IPublicEvent[],
                meta: (res as unknown as { meta: PaginationMeta }).meta,
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000, // 1 min — public listing doesn't need instant updates
    });
}

// ============================================================
// Single Event by Slug
// ============================================================

export function usePublicEventBySlug(slug: string) {
    return useQuery({
        queryKey: publicEventsQueryKeys.eventBySlug(slug),
        queryFn: async () => {
            const res = await getPublicEventBySlugAction(slug);
            if (!res.success) throw new Error(res.message);
            return res.data as IPublicEvent;
        },
        enabled: !!slug,
        staleTime: 60 * 1000,
    });
}

// ============================================================
// Featured Event
// ============================================================

export function useFeaturedPublicEvent() {
    return useQuery({
        queryKey: publicEventsQueryKeys.featuredEvent,
        queryFn: async () => {
            const res = await getFeaturedEventAction();
            if (!res.success) throw new Error(res.message);
            // console.log(res);
            return res;
        },
        staleTime: 5 * 60 * 1000, // 5 min — featured rarely changes
    });
}

// ============================================================
// Categories
// ============================================================

export function usePublicCategories() {
    return useQuery({
        queryKey: publicEventsQueryKeys.categories,
        queryFn: async () => {
            const res = await getPublicCategoriesAction();
            if (!res.success) throw new Error(res.message);
            return (res.data ?? []) as IPublicCategory[];
        },
        staleTime: 5 * 60 * 1000, // categories rarely change
    });
}

// ============================================================
// Join Event
// ============================================================

type JoinEventResponse =
    | {
          status: "PAYMENT_REQUIRED";
          payment: {
              paymentId: string;
              transactionId: string;
              paymentUrl: string;
          };
      }
    | {
          id: string;
          status: "APPROVED" | "PENDING";
          eventId: string;
          userId: string;
      };

export function useJoinPublicEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: string) => joinEventAction(eventId),

        onSuccess: (res) => {
            if (!res.success) {
                toast.error(res.message);
                return;
            }

            const data = res.data as JoinEventResponse;

            // ✅ paid event — redirect to payment gateway
            if ("status" in data && data.status === "PAYMENT_REQUIRED") {
                const paymentUrl = data.payment?.paymentUrl;

                if (paymentUrl) {
                    window.location.href = paymentUrl;
                    return;
                }

                toast.error("Payment URL not found. Please try again.");
                return;
            }

            // ✅ free event joined response
            if ("status" in data && data.status === "APPROVED") {
                toast.success("You have joined the event!");
            }

            if ("status" in data && data.status === "PENDING") {
                toast.success("Join request sent. Waiting for host approval.");
            }

            // ✅ refetch dashboard queries
            queryClient.invalidateQueries({ queryKey: ["my-joined-events"] });
            queryClient.invalidateQueries({ queryKey: ["my-events"] });
            queryClient.invalidateQueries({ queryKey: ["public-events"] });
        },

        onError: (error: any) => {
            toast.error(error?.message || "Failed to join event.");
        },
    });
}
// ============================================================
// Reviews
// ============================================================

export function useEventReviews(eventId: string) {
    return useQuery({
        queryKey: publicEventsQueryKeys.reviews(eventId),
        queryFn: async () => {
            const res = await getEventReviewsAction(eventId);
            // console.log("Reviews response:", res);
            if (!res.success) throw new Error(res.message);
            return (res.data ?? []) as IPublicReview[];
        },
        enabled: !!eventId,
        staleTime: 0,
    });
}

export function useCreateReview(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ICreateReviewPayload) =>
            createReviewAction(payload),
        onSuccess: (res) => {
            if (!res.success) {
                toast.error("Failed to submit review");
                return;
            }
            toast.success("Review submitted.");
            queryClient.refetchQueries({
                queryKey: publicEventsQueryKeys.reviews(eventId),
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to submit review.");
        },
    });
}

export function useUpdateReview(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            reviewId,
            payload,
        }: {
            reviewId: string;
            payload: IUpdateReviewPayload;
        }) => updateReviewAction(reviewId, payload),
        onSuccess: (res) => {
            if (!res.success) {
                toast.error(res.message);
                return;
            }
            toast.success("Review updated.");
            queryClient.refetchQueries({
                queryKey: publicEventsQueryKeys.reviews(eventId),
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update review.");
        },
    });
}

export function useDeleteReview(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => deleteReviewAction(reviewId),
        onSuccess: (res) => {
            if (!res.success) {
                toast.error(res.message);
                return;
            }
            toast.success("Review deleted.");
            queryClient.refetchQueries({
                queryKey: publicEventsQueryKeys.reviews(eventId),
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete review.");
        },
    });
}
