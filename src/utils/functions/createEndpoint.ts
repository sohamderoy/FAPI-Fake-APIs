import { CREATE_API_ENDPOINT_PATH } from "@/paths/paths.constants";
import { easing } from "./../../../node_modules/@mui/material/styles/createTransitions.d";
import { FapiEndpoint, FapiEndpointBase } from "@/types/fapi";

export const createEndpoint = async (
  endpoint: FapiEndpointBase
): Promise<{ success: boolean; error?: string; endpoint?: FapiEndpoint }> => {
  try {
    const createEndpointResponse = await fetch(CREATE_API_ENDPOINT_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...endpoint,
        response: JSON.parse(endpoint.response),
      }),
    });

    const data = await createEndpointResponse.json();

    if (!createEndpointResponse.ok) {
      return {
        success: false,
        error: data.error || "Failed to create endpoint",
      };
    }

    return {
      success: true,
      endpoint: data.endpoint,
    };
  } catch (error) {
    console.log("Error creating endpoint:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
