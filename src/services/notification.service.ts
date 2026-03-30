"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { INotification } from "@/types/notification.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(error: any, fallback: string): ApiErrorResponse {
    const message =
        error?.response?.data?.message || error?.message || fallback;
    return { success: false, message };
}

/** GET /notifications */
export async function getMyNotificationsAction(): Promise<
    ApiResponse<INotification[]> | ApiErrorResponse
> {
    try {
        const response =
            await httpClient.get<INotification[]>("/notifications");
            console.log(response)
        return response;
    } catch (error) {
        return handleError(error, "Failed to fetch notifications.");
    }
}
