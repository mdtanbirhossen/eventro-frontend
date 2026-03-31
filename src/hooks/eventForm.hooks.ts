"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  createEventAction,
  getEventByIdAction,
  updateEventAction,
  uploadBannerAction,
  deleteBannerAction,
  getEventCategoriesAction,
} from "@/services/eventForm.service";

import {
  ICreateEventPayload,
  IUpdateEventPayload,
} from "@/types/eventForm.types";
import { IMyEvent } from "@/types/userDashboard.type";
import { IEventCategory } from "@/types/eventCategory.types";

// ============================================================
// Query Keys
// ============================================================

export const eventFormQueryKeys = {
  eventById: (id: string) => ["event", id] as const,
  categories: ["event-form-categories"] as const,
};

// ============================================================
// Categories (dropdown)
// ============================================================

export function useEventCategories() {
  return useQuery({
    queryKey: eventFormQueryKeys.categories,
    queryFn: async () => {
      const res = await getEventCategoriesAction();
      // console.log("Fetched categories:", res);
      if (!res.success) throw new Error(res.message);
      return (res.data ?? []) as IEventCategory[];
    },
    // categories rarely change — cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================
// Get Event By ID (pre-fill edit form)
// ============================================================

export function useEventById(eventId: string) {
  return useQuery({
    queryKey: eventFormQueryKeys.eventById(eventId),
    queryFn: async () => {
      const res = await getEventByIdAction(eventId);
      if (!res.success) throw new Error(res.message);
      return res.data as IMyEvent;
    },
    enabled: !!eventId,
  });
}

// ============================================================
// Create Event
// ============================================================

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ICreateEventPayload) => createEventAction(payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Event created successfully.");
      // invalidate my-events list so it refetches
      queryClient.refetchQueries({ queryKey: ["my-events"] });
      // redirect to my events dashboard
      router.push("/dashboard/my-events");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create event.");
    },
  });
}

// ============================================================
// Update Event
// ============================================================

export function useUpdateEvent(eventId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: IUpdateEventPayload) =>
      updateEventAction(eventId, payload),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Event updated successfully.");
      // refetch the event detail + my-events list
      queryClient.refetchQueries({
        queryKey: eventFormQueryKeys.eventById(eventId),
      });
      queryClient.refetchQueries({ queryKey: ["my-events"] });
      router.push("/dashboard/my-events");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update event.");
    },
  });
}

// ============================================================
// Upload Banner
// ============================================================

export function useUploadBanner() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadBannerAction(formData);
      if (!res.success) throw new Error(res.message);
      // API returns { url: string } — return the URL
      const url = (res.data.url as string) ?? "";
      if (!url) throw new Error("No URL returned from upload.");
      return url;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload image.");
    },
  });
}

// ============================================================
// Delete Banner
// ============================================================

export function useDeleteBanner() {
  return useMutation({
    mutationFn: (urls: string[]) => deleteBannerAction(urls),
    onError: (error: Error) => {
      // silent — not critical if cleanup fails
      console.error("Banner delete failed:", error.message);
    },
  });
}