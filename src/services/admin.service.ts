
"use server";
 

import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { IAdmin, IAdminListResponse, ICreateAdminPayload } from "@/types/admin.types";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";

export async function getAllAdmins(): Promise<
  ApiResponse<IAdminListResponse> | ApiErrorResponse
> {
  try {
    const response = await httpClient.get<IAdminListResponse>("/admins/");
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch admins.");
  }
}
 
/** GET /admins/:id */
export async function getAdminById(
  id: string
): Promise<ApiResponse<IAdmin> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IAdmin>(`/admins/${id}`);
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch admin.");
  }
}
 
/** POST /admins/create-admin */
export async function createAdmin(
  payload: ICreateAdminPayload
): Promise<ApiResponse<IAdmin> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<IAdmin>(
      "/admins/create-admin",
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to create admin.");
  }
}
 