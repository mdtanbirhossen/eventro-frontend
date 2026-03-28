
"use server";
 

import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { IAdmin,  } from "@/types/admin.types";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";

export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse<{ data: IAdmin[]; meta: unknown }> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<{ data: IAdmin[]; meta: unknown }>(
      "/users",
      { params }
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch users.");
  }
}
 
/** GET /users/:id */
export async function getUserById(
  id: string
): Promise<ApiResponse<IAdmin> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IAdmin>(`/users/${id}`);
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch user.");
  }
}