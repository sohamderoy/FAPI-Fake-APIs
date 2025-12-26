import { GET_ENDPOINTS_API_PATH } from "@/utils/data";
import { EndpointKey, FapiEndpoint } from "@/types/fapi";
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

    // Transform FapiEndpoint to EndpointDetails (match Redux state shape)
    const transformedEndpoints: Record<EndpointKey, EndpointDetails> = {};

    Object.entries(data.endpoints as Record<EndpointKey, FapiEndpoint>).forEach(
      ([key, endpoint]) => {
        transformedEndpoints[key as EndpointKey] = {
          responseCode: endpoint.responseCode,
          responseDelay: endpoint.responseDelay,
          response: typeof endpoint.response === 'string'
            ? JSON.parse(endpoint.response)
            : endpoint.response,
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
