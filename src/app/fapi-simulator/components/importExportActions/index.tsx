import { Tooltip } from "@mui/material";
import { Button } from "@/components/lib";
import { STATUS_COLORS } from "@/utils/data";
import { exportEndpoints } from "@/utils/functions";
import { ImportExportActionsProps } from "./types";
import { getExportTooltip } from "./utils";

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

      <Tooltip title={getExportTooltip(currentEndpointCount)} arrow placement="top">
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
