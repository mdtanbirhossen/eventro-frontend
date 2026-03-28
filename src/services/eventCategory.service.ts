
"use server";
 

import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ICreateCategoryPayload, IEventCategory, IUpdateCategoryPayload } from "@/types/eventCategory.types";

export async function getAllCategories(): Promise<
  ApiResponse<IEventCategory[]> | ApiErrorResponse
> {
  try {
    const response = await httpClient.get<IEventCategory[]>("/event-categories");
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch categories.");
  }
}
 
/** POST /events/admin/categories */
export async function createCategory(
  payload: ICreateCategoryPayload
): Promise<ApiResponse<IEventCategory> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<IEventCategory>(
      "/event-categories",
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to create category.");
  }
}
 
/** PATCH /event-categories/:id */
export async function updateCategory(
  id: string,
  payload: IUpdateCategoryPayload
): Promise<ApiResponse<IEventCategory> | ApiErrorResponse> {
  try {
    const response = await httpClient.patch<IEventCategory>(
      `/event-categories/${id}`,
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to update category.");
  }
}
 
/** DELETE /events/admin/categories/:id */
export async function deleteCategory(
  id: string
): Promise<ApiResponse<null> | ApiErrorResponse> {
  try {
    const response = await httpClient.delete<null>(
      `/event-categories/${id}`
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to delete category.");
  }
}