"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {
  IProfile,
  IUpdateProfilePayload,
  IChangePasswordPayload,
} from "@/types/profile.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(error: any, fallback: string): ApiErrorResponse {
  const message =
    error?.response?.data?.message || error?.message || fallback;
  return { success: false, message };
}

// ============================================================
// Get current user profile
// ============================================================

/** GET /auth/me */
export async function getProfileAction(): Promise<
  ApiResponse<IProfile> | ApiErrorResponse
> {
  try {
    const response = await httpClient.get<IProfile>("/auth/me");
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch profile.");
  }
}

// ============================================================
// Update profile
// ============================================================

/** PATCH /auth/me */
export async function updateProfileAction(
  payload: IUpdateProfilePayload
): Promise<ApiResponse<IProfile> | ApiErrorResponse> {
  try {
    const response = await httpClient.patch<IProfile>("/auth/me", payload);
    return response;
  } catch (error) {
    return handleError(error, "Failed to update profile.");
  }
}

// ============================================================
// Upload avatar
// ============================================================

/** POST /upload/ */
export async function uploadAvatarAction(
  formData: FormData
): Promise<ApiResponse<{ url: string }> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<{ url: string }>(
      "/upload/",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to upload avatar.");
  }
}

// ============================================================
// Change password
// ============================================================

/** POST /auth/change-password */
export async function changePasswordAction(
  payload: IChangePasswordPayload
): Promise<ApiResponse<null> | ApiErrorResponse> {
  try {
    const response = await httpClient.post<null>(
      "/auth/change-password",
      payload
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to change password.");
  }
}

// ============================================================
// Delete account
// ============================================================

/** DELETE /auth/me  — adjust endpoint to match your backend */
export async function deleteAccountAction(): Promise<
  ApiResponse<null> | ApiErrorResponse
> {
  try {
    const response = await httpClient.delete<null>("/auth/me");
    return response;
  } catch (error) {
    return handleError(error, "Failed to delete account.");
  }
}