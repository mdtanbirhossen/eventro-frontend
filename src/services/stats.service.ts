"use server";

import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IAdminDashboardStats } from "@/types/stats.types";

export async function getAdminDashboardStats(): Promise<
    ApiResponse<IAdminDashboardStats> | ApiErrorResponse
> {
    try {
        const response = await httpClient.get<IAdminDashboardStats>("/stats");
        return response;
    } catch (error) {
        return handleError(error, "Failed to fetch dashboard stats.");
    }
}
