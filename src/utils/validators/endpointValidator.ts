import { HttpMethods } from "@/types/fapi";
import { FAPI } from "@/utils/data/global.constants";
import { EndpointValidationResult } from "./types";

/**
 * Validates if HTTP method is supported
 */
export const isValidHttpMethod = (method: string): boolean => {
  const validMethods = Object.values(FAPI.SUPPORTED_HTTP_METHODS);
  return validMethods.includes(method as HttpMethods);
};

/**
 * Validates if response code is supported
 */
export const isValidResponseCode = (code: number): boolean => {
  const validCodes = Object.values(FAPI.SUPPORTED_HTTP_RESPONSE_STATUS_CODE).map(
    (status) => status.code
  );
  return validCodes.includes(code);
};

/**
 * Validates if response delay is supported
 */
export const isValidResponseDelay = (delay: number): boolean => {
  const validDelays = Object.values(FAPI.SUPPORTED_RESPONSE_DELAYS).map(
    (d) => d.value
  );
  return validDelays.includes(delay);
};

/**
 * Validates endpoint key format (e.g., "GET /users")
 * Must be exactly 2 parts: METHOD and /path
 */
export const isValidEndpointKey = (key: string): boolean => {
  const parts = key.split(" ");

  // Must be exactly 2 parts
  if (parts.length !== 2) return false;

  const [method, path] = parts;

  return isValidHttpMethod(method) && path.startsWith("/");
};

/**
 * Validates a single endpoint's structure and values
 */
export const validateEndpoint = (
  key: string,
  details: any
): EndpointValidationResult => {
  // Validate key format
  if (!isValidEndpointKey(key)) {
    return {
      isValid: false,
      error: `Invalid endpoint key format: "${key}". Expected format: "METHOD /path" (exactly 2 parts separated by space)`,
      invalidKey: key,
    };
  }

  // Validate details is an object
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return {
      isValid: false,
      error: `Invalid endpoint details for "${key}" - must be an object`,
      invalidKey: key,
    };
  }

  // Validate required fields exist
  if (!("responseCode" in details)) {
    return {
      isValid: false,
      error: `Missing 'responseCode' for endpoint "${key}"`,
      invalidKey: key,
    };
  }

  if (!("responseDelay" in details)) {
    return {
      isValid: false,
      error: `Missing 'responseDelay' for endpoint "${key}"`,
      invalidKey: key,
    };
  }

  if (!("response" in details)) {
    return {
      isValid: false,
      error: `Missing 'response' for endpoint "${key}"`,
      invalidKey: key,
    };
  }

  // Validate field types
  if (typeof details.responseCode !== "number") {
    return {
      isValid: false,
      error: `Invalid 'responseCode' for endpoint "${key}" - must be a number`,
      invalidKey: key,
    };
  }

  if (typeof details.responseDelay !== "number") {
    return {
      isValid: false,
      error: `Invalid 'responseDelay' for endpoint "${key}" - must be a number`,
      invalidKey: key,
    };
  }

  if (typeof details.response !== "object" || details.response === null) {
    return {
      isValid: false,
      error: `Invalid 'response' for endpoint "${key}" - must be an object`,
      invalidKey: key,
    };
  }

  // Validate responseCode is supported
  if (!isValidResponseCode(details.responseCode)) {
    const supportedCodes = Object.values(
      FAPI.SUPPORTED_HTTP_RESPONSE_STATUS_CODE
    )
      .map((s) => s.code)
      .join(", ");
    return {
      isValid: false,
      error: `Unsupported response code ${details.responseCode} for endpoint "${key}". Supported codes: ${supportedCodes}`,
      invalidKey: key,
    };
  }

  // Validate responseDelay is supported
  if (!isValidResponseDelay(details.responseDelay)) {
    const supportedDelays = Object.values(FAPI.SUPPORTED_RESPONSE_DELAYS)
      .map((d) => `${d.value}ms`)
      .join(", ");
    return {
      isValid: false,
      error: `Unsupported response delay ${details.responseDelay}ms for endpoint "${key}". Supported delays: ${supportedDelays}`,
      invalidKey: key,
    };
  }

  return { isValid: true };
};
