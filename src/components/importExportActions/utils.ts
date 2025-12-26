export const getExportTooltip = (currentEndpointCount: number): string => {
  if (currentEndpointCount === 0) {
    return "No endpoints to export";
  }
  return "Export FAPI details to JSON file";
};
