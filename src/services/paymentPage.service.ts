"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IPaymentDetail } from "@/types/paymentPages.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(error: any, fallback: string): ApiErrorResponse {
  const message =
    error?.response?.data?.message || error?.message || fallback;
  return { success: false, message };
}

/**
 * GET /payment/my
 * Fetch all user payments then find by transactionId on client,
 * OR if your backend supports GET /payment/transaction/:tran_id use that.
 */
export async function getPaymentByTransactionIdAction(
  tran_id: string
): Promise<ApiResponse<IPaymentDetail> | ApiErrorResponse> {
  try {
    const response = await httpClient.get<IPaymentDetail>(
      `/payment/transaction/${tran_id}`
    );
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch payment details.");
  }
}

/**
 * GET /payment/my — fallback if no single-payment endpoint exists
 * Returns all user payments so the client can find by tran_id
 */
export async function getMyPaymentsForVerificationAction(): Promise<
  ApiResponse<IPaymentDetail[]> | ApiErrorResponse
> {
  try {
    const response = await httpClient.get<IPaymentDetail[]>("/payment/my");
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch payments.");
  }
}