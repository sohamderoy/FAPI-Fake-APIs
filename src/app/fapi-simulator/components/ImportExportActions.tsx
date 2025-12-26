import { Tooltip } from "@mui/material";
import Button from "@/components/lib/button";
import { STATUS_COLORS } from "@/utils/data/global.constants";
import { exportEndpoints } from "@/utils/functions/exportEndpoints";
import { EndpointKey } from "@/types/fapi";
import { EndpointDetails } from "@/store/types/endpoints";

interface ImportExportActionsProps {
  isImporting: boolean;
  currentEndpointCount: number;
  endpoints: Record<EndpointKey, EndpointDetails>;
  projectName: string;
  onImport: () => void;
  setSnackbar: (snackbar: {
    isOpen: boolean;
    message: string;
    backgroundColor: string;
  }) => void;
}

const ImportExportActions = ({
  isImporting,
  currentEndpointCount,
  endpoints,
  projectName,
  onImport,
  setSnackbar,
}: ImportExportActionsProps) => {
  const handleExport = () => {
    exportEndpoints(endpoints, projectName);
    setSnackbar({
      isOpen: true,
      message: `Successfully exported ${currentEndpointCount} endpoint(s)`,
      backgroundColor: STATUS_COLORS.SUCCESS,
    });
  };

  const getExportTooltip = (): string => {
    if (currentEndpointCount === 0) {
      return "No endpoints to export";
    }
    return "Export FAPI details to JSON file";
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip
        title="Import FAPI details from JSON file"
        arrow
        placement="top"
      >
        <span>
          <Button
            onClick={onImport}
            name="Import FAPIs"
            disabled={isImporting}
            variant="secondary"
          />
        </span>
      </Tooltip>

      <Tooltip title={getExportTooltip()} arrow placement="top">
        <span>
          <Button
            onClick={handleExport}
            name="Export FAPIs"
            disabled={currentEndpointCount === 0}
            variant="secondary"
          />
        </span>
      </Tooltip>
    </div>
  );
};

export default ImportExportActions;
