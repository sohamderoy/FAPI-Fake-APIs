import { ValidationResult } from "./types";
import { FAPI_LIMITS } from "@/utils/data/global.constants";

/**
 * Validates file extension
 */
export const validateFileExtension = (file: File): ValidationResult => {
  if (!file.name.endsWith(".json")) {
    return {
      isValid: false,
      error: "Only JSON files are supported",
    };
  }
  return { isValid: true };
};

/**
 * Validates file size
 */
export const validateFileSize = (file: File): ValidationResult => {
  if (file.size > FAPI_LIMITS.MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds ${FAPI_LIMITS.MAX_FILE_SIZE_MB}MB limit`,
    };
  }
  return { isValid: true };
};

/**
 * Validates file at basic level (extension + size)
 */
export const validateFile = (file: File): ValidationResult => {
  const extensionCheck = validateFileExtension(file);
  if (!extensionCheck.isValid) return extensionCheck;

  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.isValid) return sizeCheck;

  return { isValid: true };
};
