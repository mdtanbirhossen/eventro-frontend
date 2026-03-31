"use client";

import { createAdmin, getAdminById, getAllAdmins } from "@/services/admin.service";
import { adminForceDeleteEvent, getAdminAllEvents, setFeaturedEvent } from "@/services/event.service";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "@/services/eventCategory.service";
import { getFeaturedEvent } from "@/services/featuredEvent.service";
import { approveParticipant, banParticipant, getEventParticipants, rejectParticipant } from "@/services/participant.service";
import { getAdminAllPayments } from "@/services/payment.service";
import { getAdminDashboardStats } from "@/services/stats.service";
import { getAllUsers, getUserById } from "@/services/user.service";
import { ICreateAdminPayload } from "@/types/admin.types";
import { IAdminEventQueryParams } from "@/types/event.types";
import { ICreateCategoryPayload, IUpdateCategoryPayload } from "@/types/eventCategory.types";
import { IBanParticipantPayload } from "@/types/participant.types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";



// ============================================================
// Query Keys — centralised so invalidation is consistent
// ============================================================

export const adminQueryKeys = {
  // admins
  admins: ["admins"] as const,
  adminById: (id: string) => ["admins", id] as const,

  // users
  users: (params?: Record<string, unknown>) => ["users", params] as const,
  userById: (id: string) => ["users", id] as const,

  // events
  adminEvents: (params?: IAdminEventQueryParams) =>
    ["admin-events", params] as const,
  featuredEvent: ["featured-event"] as const,

  // categories
  categories: ["categories"] as const,

  // participants
  participants: (eventId: string, status?: string) =>
    ["participants", eventId, status] as const,

  // payments
  adminPayments: ["admin-payments"] as const,

  // dashboard
  dashboardStats: ["dashboard-stats"] as const,
} as const;

// ============================================================
// Admin Management Hooks
// ============================================================

export function useAdmins() {
  return useQuery({
    queryKey: adminQueryKeys.admins,
    queryFn: async () => {
      const res = await getAllAdmins();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useAdminById(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.adminById(id),
    queryFn: async () => {
      const res = await getAdminById(id);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateAdminPayload) => createAdmin(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Admin created successfully.");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.admins });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create admin.");
    },
  });
}

// ============================================================
// User Management Hooks
// ============================================================

export function useUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: adminQueryKeys.users(params),
    queryFn: async () => {
      const res = await getAllUsers(params);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    placeholderData: keepPreviousData, // keeps previous page data while fetching next
  });
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.userById(id),
    queryFn: async () => {
      const res = await getUserById(id);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: !!id,
  });
}

// ============================================================
// Event Management Hooks (admin)
// ============================================================

export function useAdminEvents(params?: IAdminEventQueryParams) {
  return useQuery({
    queryKey: adminQueryKeys.adminEvents(params),
    queryFn: async () => {
      const res = await getAdminAllEvents(params);
      // console.log(res)
      if (!res.success) throw new Error(res.message);
      return res;
    },
    placeholderData: keepPreviousData,
  });
}

export function useFeaturedEvent() {
  return useQuery({
    queryKey: adminQueryKeys.featuredEvent,
    queryFn: async () => {
      const res = await getFeaturedEvent();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useSetFeaturedEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => setFeaturedEvent(eventId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Featured event updated.");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.featuredEvent });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update featured event.");
    },
  });
}

export function useAdminForceDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => adminForceDeleteEvent(eventId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Event deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete event.");
    },
  });
}

// ============================================================
// Category Hooks
// ============================================================

export function useCategories() {
  return useQuery({
    queryKey: adminQueryKeys.categories,
    queryFn: async () => {
      const res = await getAllCategories();
      // console.log(res)
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateCategoryPayload) => createCategory(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Category created.");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category.");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateCategoryPayload;
    }) => updateCategory(id, payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Category updated.");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category.");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.categories });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category.");
    },
  });
}

// ============================================================
// Participant Hooks
// ============================================================

export function useEventParticipants(
  eventId: string,
  status?: "PENDING" | "APPROVED" | "REJECTED" | "BANNED"
) {
  return useQuery({
    queryKey: adminQueryKeys.participants(eventId, status),
    queryFn: async () => {
      const res = await getEventParticipants(eventId, status);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: !!eventId,
  });
}

export function useApproveParticipant(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => approveParticipant(eventId, userId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Participant approved.");
      queryClient.invalidateQueries({
        queryKey: ["participants", eventId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve participant.");
    },
  });
}

export function useRejectParticipant(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => rejectParticipant(eventId, userId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Participant rejected.");
      queryClient.invalidateQueries({
        queryKey: ["participants", eventId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject participant.");
    },
  });
}

export function useBanParticipant(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: IBanParticipantPayload;
    }) => banParticipant(eventId, userId, payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Participant banned.");
      queryClient.invalidateQueries({
        queryKey: ["participants", eventId],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to ban participant.");
    },
  });
}

// ============================================================
// Payment Hooks
// ============================================================

export function useAdminPayments() {
  return useQuery({
    queryKey: adminQueryKeys.adminPayments,
    queryFn: async () => {
      const res = await getAdminAllPayments();
      // console.log(res)
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}

// ============================================================
// Dashboard Stats Hook
// ============================================================

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminQueryKeys.dashboardStats,
    queryFn: async () => {
      const res = await getAdminDashboardStats();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
  });
}