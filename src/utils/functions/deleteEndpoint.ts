import { DELETE_API_ENDPOINT_API_PATH } from "@/utils/data/paths/paths.api.constants";
import { HttpMethods } from "@/types/fapi";

export const deleteEndpoint = async (
  method: HttpMethods,
  path: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const deleteEndpointResponse = await fetch(DELETE_API_ENDPOINT_API_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method,
        path,
      }),
    });

    const data = await deleteEndpointResponse.json();

    if (!deleteEndpointResponse.ok) {
      return {
        success: false,
        error: data.error || "Failed to delete endpoint",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log("Error deleting endpoint:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
