import {
  EXPORT_ENDPOINTS_API_PATH,
  FAPI_EXPORT_FILENAME_PREFIX,
} from "@/utils/data";

export interface ExportResult {
  success: boolean;
  error?: string;
}

export const exportEndpoints = async (
  projectName?: string,
): Promise<ExportResult> => {
  try {
    // Fetch complete endpoint data from backend
    const response = await fetch(EXPORT_ENDPOINTS_API_PATH, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || "Failed to export endpoints",
      };
    }

    const data = await response.json();

    // Build export format
    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      endpoints: data.endpoints,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Generate filename with project name if provided
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD in local timezone
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const timeStr = `${hours}${minutes}${seconds}`; // HHmmss

    let filename = `${FAPI_EXPORT_FILENAME_PREFIX}-`;

    // Use projectName from API response if not provided
    const finalProjectName = projectName ?? data.projectName;
    if (finalProjectName && finalProjectName.trim()) {
      const sanitizedProjectName = finalProjectName.trim().replace(/\s+/g, "_");
      filename += `${sanitizedProjectName}-`;
    }

    filename += `${dateStr}-${timeStr}.json`;

    // Create temporary download link
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Error exporting endpoints:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
