"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getMyEvents,
  getMyDraftEvents,
  getMyJoinedEvents,
  joinEvent,
  getMyInvitations,
  respondToInvitation,
  getMyPayments,
  createPaymentSession,
  updateMyEvent,
  deleteMyEvent,
} from "@/services/userDashboard.service";

import {
  IMyEventsQueryParams,
  IMyEvent,
  IRespondInvitationPayload,
  ICreatePaymentSessionPayload,
} from "@/types/userDashboard.type";

// ============================================================
// Query Keys
// ============================================================

export const userDashboardQueryKeys = {
  myEvents: (params?: IMyEventsQueryParams) =>
    ["my-events", params] as const,
  myDraftEvents: ["my-draft-events"] as const,
  myJoinedEvents: ["my-joined-events"] as const,
  myInvitations: ["my-invitations"] as const,
  myPayments: ["my-payments"] as const,
} as const;

// ============================================================
// My Created Events
// ============================================================

export function useMyEvents(params?: IMyEventsQueryParams) {
  return useQuery({
    queryKey: userDashboardQueryKeys.myEvents(params),
    queryFn: async () => {
      const res = await getMyEvents(params);
      if (!res.success) throw new Error(res.message);
      return {
        data: res.data as IMyEvent[],
        meta: (res as unknown as { meta: { total: number; page: number; limit: number; totalPages: number } }).meta,
      };
    },
    placeholderData: keepPreviousData,
  });
}

export function useMyDraftEvents() {
  return useQuery({
    queryKey: userDashboardQueryKeys.myDraftEvents,
    queryFn: async () => {
      const res = await getMyDraftEvents();
      if (!res.success) throw new Error(res.message);
      return res.data as IMyEvent[];
    },
  });
}

export function useUpdateMyEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: string;
      payload: Partial<IMyEvent>;
    }) => updateMyEvent(eventId, payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Event updated successfully.");
      queryClient.refetchQueries({ queryKey: ["my-events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update event.");
    },
  });
}

export function useDeleteMyEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => deleteMyEvent(eventId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Event deleted.");
      queryClient.refetchQueries({ queryKey: ["my-events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete event.");
    },
  });
}

// ============================================================
// My Joined Events
// ============================================================

export function useMyJoinedEvents() {
  return useQuery({
    queryKey: userDashboardQueryKeys.myJoinedEvents,
    queryFn: async () => {
      const res = await getMyJoinedEvents();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useJoinEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => joinEvent(eventId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Successfully joined the event.");
      queryClient.refetchQueries({
        queryKey: userDashboardQueryKeys.myJoinedEvents,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to join event.");
    },
  });
}

// ============================================================
// My Invitations
// ============================================================

export function useMyInvitations() {
  return useQuery({
    queryKey: userDashboardQueryKeys.myInvitations,
    queryFn: async () => {
      const res = await getMyInvitations();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 0,
  });
}

export function useRespondToInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invitationId,
      payload,
    }: {
      invitationId: string;
      payload: IRespondInvitationPayload;
    }) => respondToInvitation(invitationId, payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      const action = (res.data as { status?: string })?.status;
      toast.success(
        action === "ACCEPTED"
          ? "Invitation accepted."
          : "Invitation declined."
      );
      // refetch both — accepting auto-joins the event
      queryClient.refetchQueries({
        queryKey: userDashboardQueryKeys.myInvitations,
      });
      queryClient.refetchQueries({
        queryKey: userDashboardQueryKeys.myJoinedEvents,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to respond to invitation.");
    },
  });
}

// ============================================================
// My Payments
// ============================================================

export function useMyPayments() {
  return useQuery({
    queryKey: userDashboardQueryKeys.myPayments,
    queryFn: async () => {
      const res = await getMyPayments();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    staleTime: 0,
  });
}

export function useCreatePaymentSession() {
  return useMutation({
    mutationFn: (payload: ICreatePaymentSessionPayload) =>
      createPaymentSession(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      // ✅ Redirect to SSLCommerz / ShurjoPay gateway URL
      const paymentUrl = (res.data as { paymentUrl?: string })?.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Payment URL not received.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate payment.");
    },
  });
}