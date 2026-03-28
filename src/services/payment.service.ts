
"use server";
 

import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IAdminPaymentListResponse } from "@/types/payment.types";


/** GET /payment/my  — admin all payments (same endpoint per Postman) */
export async function getAdminAllPayments(): Promise<
  ApiResponse<IAdminPaymentListResponse> | ApiErrorResponse
> {
  try {
    const response =
      await httpClient.get<IAdminPaymentListResponse>("/payment/my");
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch payments.");
  }
}