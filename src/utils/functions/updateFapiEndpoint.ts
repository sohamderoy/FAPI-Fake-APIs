import { UPDATE_ENDPOINT_API_PATH } from "@/utils/data";
import { HttpMethods } from "@/types/fapi";

export interface UpdateFapiEndpointParams {
  method: HttpMethods;
  path: string;
  response?: string;
  responseCode?: number;
  responseDelay?: number;
}

export const updateFapiEndpoint = async (
  params: UpdateFapiEndpointParams
): Promise<{ success: boolean; error?: string }> => {
  try {
    const updateEndpointResponse = await fetch(UPDATE_ENDPOINT_API_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await updateEndpointResponse.json();

    if (!updateEndpointResponse.ok) {
      return {
        success: false,
        error: data.error || "Failed to update endpoint",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("Error updating endpoint:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
