"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
    payload: ILoginPayload,
): Promise<ApiResponse<ILoginResponse> | ApiErrorResponse> => {
    const parsedPayload = loginZodSchema.safeParse(payload);

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
            "/auth/login",
            parsedPayload.data,
        );

        const { accessToken, refreshToken, token, user } = response.data;
        const { role, needPasswordChange, email } = user;

        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies(
            "better-auth.session_token",
            token,
            24 * 60 * 60,
        );

        await setTokenInCookies("user", JSON.stringify(user));

        return response;
    } catch (error: any) {
        /**
         * IMPORTANT:
         * redirect() throws NEXT_REDIRECT internally, it is not an error
         * so we must rethrow it immediately
         */
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
            error?.response?.data?.message || error?.message || "Login failed";

        // Email verification redirect
        if (message === "Email not verified") {
            redirect(`/verify-email?email=${payload.email}`);
        }

        return {
            success: false,
            message,
        };
    }
};
