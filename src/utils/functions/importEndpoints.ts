import { IMPORT_ENDPOINTS_API_PATH } from "@/utils/data/paths/paths.api.constants";
import { EndpointKey } from "@/types/fapi";
import { EndpointDetails } from "@/store/types/endpoints";
import { ExportData } from "./exportEndpoints";
import { validateFile } from "@/utils/validators/fileValidator";
import { validateImportData } from "@/utils/validators/importValidator";
import { IMPORT_STRATEGY, ImportStrategy } from "@/utils/data/global.constants";

export interface ImportResult {
  success: boolean;
  error?: string;
  addedCount?: number;
  skippedCount?: number;
  totalEndpoints?: number;
  message?: string;
}

export const importEndpoints = async (
  file: File,
  strategy: ImportStrategy = IMPORT_STRATEGY.MERGE,
  currentEndpointCount: number
): Promise<ImportResult> => {
  try {
    // Validate file (extension and size)
    const fileValidation = validateFile(file);
    if (!fileValidation.isValid) {
      return {
        success: false,
        error: fileValidation.error,
      };
    }

    // Read file
    const text = await file.text();

    // Parse JSON
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        success: false,
        error: "Invalid JSON file - unable to parse",
      };
    }

    // Comprehensive validation using validators
    const isReplaceMode = strategy === IMPORT_STRATEGY.REPLACE;
    const validation = validateImportData(data, currentEndpointCount, isReplaceMode);

    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // All validations passed, send to API
    const response = await fetch(IMPORT_ENDPOINTS_API_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoints: data.endpoints,
        strategy,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to import endpoints",
      };
    }

    return {
      success: true,
      addedCount: result.addedCount,
      skippedCount: result.skippedCount,
      totalEndpoints: result.totalEndpoints,
      message: result.message,
    };
  } catch (error) {
    console.error("Error importing endpoints:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
