import { ValidationResult } from "./types";
import { validateEndpoint } from "./endpointValidator";
import { FAPI_LIMITS } from "@/utils/data/global.constants";

/**
 * Validates the structure of import data
 */
export const validateImportStructure = (data: any): ValidationResult => {
  // Validate root structure
  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      error: "Invalid file format - must be a JSON object",
    };
  }

  // Validate version field (if present)
  if (data.version && typeof data.version !== "string") {
    return {
      isValid: false,
      error: "Invalid file format - version must be a string",
    };
  }

  // Validate endpoints field
  if (!data.endpoints || typeof data.endpoints !== "object") {
    return {
      isValid: false,
      error: "Invalid file format - missing or invalid 'endpoints' field",
    };
  }

  // Validate endpoints is not an array
  if (Array.isArray(data.endpoints)) {
    return {
      isValid: false,
      error: "Invalid file format - 'endpoints' must be an object, not an array",
    };
  }

  return { isValid: true };
};

/**
 * Validates endpoint count in import file
 */
export const validateEndpointCount = (
  endpointEntries: [string, any][]
): ValidationResult => {
  // Check if there are any endpoints
  if (endpointEntries.length === 0) {
    return {
      isValid: false,
      error: "No endpoints found in the file",
    };
  }

  // Validate maximum number of endpoints per file
  if (endpointEntries.length > FAPI_LIMITS.MAX_ENDPOINTS) {
    return {
      isValid: false,
      error: `This file contains ${endpointEntries.length} endpoints. Maximum ${FAPI_LIMITS.MAX_ENDPOINTS} endpoints allowed per file.`,
    };
  }

  return { isValid: true };
};

/**
 * Validates all endpoints in the import data
 */
export const validateAllEndpoints = (
  endpointEntries: [string, any][]
): ValidationResult => {
  for (const [key, details] of endpointEntries) {
    const result = validateEndpoint(key, details);
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
};

/**
 * Validates total endpoint count after import
 */
export const validateTotalEndpointCount = (
  currentCount: number,
  importingCount: number,
  isReplaceMode: boolean
): ValidationResult => {
  const finalCount = isReplaceMode ? importingCount : currentCount + importingCount;

  if (finalCount > FAPI_LIMITS.MAX_ENDPOINTS) {
    return {
      isValid: false,
      error: `Cannot import: Would result in ${finalCount} endpoints (maximum: ${FAPI_LIMITS.MAX_ENDPOINTS}). Current: ${currentCount}, Importing: ${importingCount}.`,
    };
  }

  return { isValid: true };
};

/**
 * Master validation function for import data
 */
export const validateImportData = (
  data: any,
  currentEndpointCount: number,
  isReplaceMode: boolean
): ValidationResult => {
  // Validate structure
  const structureCheck = validateImportStructure(data);
  if (!structureCheck.isValid) return structureCheck;

  const endpointEntries = Object.entries(data.endpoints);

  // Validate endpoint count in file
  const countCheck = validateEndpointCount(endpointEntries);
  if (!countCheck.isValid) return countCheck;

  // Validate all endpoints
  const endpointsCheck = validateAllEndpoints(endpointEntries);
  if (!endpointsCheck.isValid) return endpointsCheck;

  // Validate total count after import
  const totalCountCheck = validateTotalEndpointCount(
    currentEndpointCount,
    endpointEntries.length,
    isReplaceMode
  );
  if (!totalCountCheck.isValid) return totalCountCheck;

  return { isValid: true };
};
