
"use server";
 

import { httpClient } from "@/lib/axios/httpClient";
import handleError from "@/lib/handleError";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IEvent } from "@/types/event.types";

export async function getFeaturedEvent(): Promise<
  ApiResponse<IEvent> | ApiErrorResponse
> {
  try {
    const response = await httpClient.get<IEvent>("/events/featured");
    return response;
  } catch (error) {
    return handleError(error, "Failed to fetch featured event.");
  }
}