"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  sendBulkInvitationsAction,
  searchUsersAction,
  getEventInvitationsAction,
} from "@/services/sendBulkInvitations.service";
import {
  ISendBulkInvitationsPayload,
  IUserForInvitation,
  ISearchUsersParams,
} from "@/types/sendBulkInvitations.types";

export const bulkInvitationsQueryKeys = {
  search: (params?: ISearchUsersParams) =>
    ["search-users", params] as const,
  eventInvitations: (eventId: string) =>
    ["event-invitations", eventId] as const,
};

/**
 * Hook: Search users for invitations
 * GET /api/users/search
 */
export function useSearchUsers(params?: ISearchUsersParams) {
  return useQuery({
    queryKey: bulkInvitationsQueryKeys.search(params),
    queryFn: async () => {
      const res = await searchUsersAction(params);
      console.log("Search Users Result in Hook:", res);
      if (!res.success) throw new Error(res.message);
      return (res.data ?? []) as IUserForInvitation[];
    },
    enabled: !!params?.search || false, // Only fetch when there's a search term
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook: Get already invited users for an event
 * GET /events/:eventId/invitations
 */
export function useEventInvitations(eventId: string) {
  return useQuery({
    queryKey: bulkInvitationsQueryKeys.eventInvitations(eventId),
    queryFn: async () => {
      const res = await getEventInvitationsAction(eventId);
      if (!res.success) throw new Error(res.message);
      return (res.data ?? []).map((inv) => inv.invitedUserId);
    },
    enabled: !!eventId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook: Send bulk invitations
 * POST /events/:eventId/invite
 */
export function useSendBulkInvitations(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ISendBulkInvitationsPayload) => {
      const res = await sendBulkInvitationsAction(eventId, payload);
      console.log("Send Bulk Invitations Result in Hook:", res);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (data) => {
      const summary = data?.summary;
      if (!summary) return;

      if (summary.failedCount === 0) {
        toast.success(
          `Invitations sent to ${summary.successCount} user${
            summary.successCount !== 1 ? "s" : ""
          }! ✨`
        );
      } else {
        toast.error(
          `${summary.successCount} sent, ${summary.failedCount} failed`
        );
      }

      // Invalidate event invitations cache
      queryClient.invalidateQueries({
        queryKey: bulkInvitationsQueryKeys.eventInvitations(eventId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send invitations");
    },
  });
}