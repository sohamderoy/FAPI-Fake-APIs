import { EndpointKey } from "@/types/fapi";
import type { EndpointDetails } from "@/store";
import { FAPI_EXPORT_FILENAME_PREFIX } from "@/utils/data";

export interface ExportData {
  version: string;
  exportedAt: string;
  endpoints: Record<EndpointKey, EndpointDetails>;
}

export const exportEndpoints = (
  endpoints: Record<EndpointKey, EndpointDetails>,
  projectName?: string
): void => {
  const exportData: ExportData = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    endpoints,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Generate filename with project name if provided
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeStr = `${hours}${minutes}${seconds}`; // HHmmss

  let filename = `${FAPI_EXPORT_FILENAME_PREFIX}-`;

  if (projectName && projectName.trim()) {
    // Replace spaces with underscores
    const sanitizedProjectName = projectName.trim().replace(/\s+/g, '_');
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
};
