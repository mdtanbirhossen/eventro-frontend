import { ApiErrorResponse } from "@/types/api.types";

export default function handleError(error: any, fallback: string): ApiErrorResponse {
  const message =
    error?.response?.data?.message || error?.message || fallback;
  return { success: false, message };
}
 