"use client";

import { getMyNotificationsAction } from "@/services/notification.service";
import { INotification } from "@/types/notification.types";
import { useQuery } from "@tanstack/react-query";

export const notificationQueryKeys = {
    myNotifications: ["my-notifications"] as const,
};

export function useMyNotifications() {
    return useQuery({
        queryKey: notificationQueryKeys.myNotifications,
        queryFn: async () => {
            const res = await getMyNotificationsAction();
            if (!res.success) throw new Error(res.message);
            // console.log("Fetched notifications:", res.data);
            return (res.data ?? []) as INotification[];
        },
        // poll every 30s so new notifications appear without refresh
        refetchInterval: 30 * 1000,
        staleTime: 0,
    });
}
