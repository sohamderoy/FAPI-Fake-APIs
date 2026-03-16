import { GET_ENDPOINTS_API_PATH } from "@/utils/data";
import { EndpointKey } from "@/types/fapi";
import { EndpointDetails } from "@/store/types/endpoints";

export const loadEndpoints = async (): Promise<{
  success: boolean;
  endpoints?: Record<EndpointKey, EndpointDetails>;
  projectName?: string;
  error?: string;
}> => {
  try {
    const response = await fetch(GET_ENDPOINTS_API_PATH, {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to load endpoints",
      };
    }

    // Response bodies are not included in the listing - they are fetched on-demand
    const transformedEndpoints: Record<EndpointKey, EndpointDetails> = {};

    Object.entries(data.endpoints).forEach(
      ([key, endpoint]) => {
        const ep = endpoint as { responseCode: number; responseDelay: number };
        transformedEndpoints[key as EndpointKey] = {
          responseCode: ep.responseCode,
          responseDelay: ep.responseDelay,
        };
      }
    );

    return {
      success: true,
      endpoints: transformedEndpoints,
      projectName: data.metadata?.projectName || "",
    };
  } catch (error) {
    console.error("Error loading endpoints:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
