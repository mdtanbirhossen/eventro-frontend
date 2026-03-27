"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { registerZodSchema, IRegisterPayload } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (
  payload: IRegisterPayload
): Promise<ApiResponse<ILoginResponse> | ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0].message || "Invalid input";

    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/register",
      parsedPayload.data
    );

    const { accessToken, refreshToken, token, user } = response.data;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
    await setTokenInCookies("user", JSON.stringify(user));

    return response;
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    const message =
      error?.response?.data?.message || error?.message || "Registration failed";

    // if backend sends email verification required
    if (message === "Email not verified") {
      redirect(`/verify-email?email=${payload.email}`);
    }

    return {
      success: false,
      message,
    };
  }
};