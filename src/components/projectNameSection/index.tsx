import { TextField, IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Save as SaveIcon } from "lucide-react";
import { UI_LIMITS } from "@/utils/data";
import { ProjectNameSectionProps } from "./types";
import { getTooltipTitle } from "./utils";

const ProjectNameSection = ({
  currentProjectName,
  projectNameError,
  hasProjectNameChanges,
  isSavingProjectName,
  onProjectNameChange,
  onSaveProjectName,
}: ProjectNameSectionProps) => {
  return (
    <div className="flex items-start gap-2 flex-1">
      <div className="flex-1 max-w-lg">
        <TextField
          fullWidth
          size="small"
          label="Add the name of you project that FAPI is supporting (Optional)"
          value={currentProjectName}
          onChange={onProjectNameChange}
          error={!!projectNameError}
          helperText={projectNameError}
          placeholder="e.g., The Next Big Web Application"
          className="font-googleSansFlex"
          InputProps={{
            className: "font-googleSansFlex",
          }}
          inputProps={{
            maxLength: UI_LIMITS.PROJECT_NAME_MAX_LENGTH,
          }}
        />
      </div>
      <Tooltip
        arrow
        placement="top"
        title={getTooltipTitle(hasProjectNameChanges, projectNameError)}
      >
        <span>
          <IconButton
            onClick={onSaveProjectName}
            color="secondary"
            disabled={
              !hasProjectNameChanges ||
              !!projectNameError ||
              isSavingProjectName
            }
            size="small"
          >
            {isSavingProjectName ? (
              <CircularProgress size={20} color="secondary" />
            ) : (
              <SaveIcon size={20} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

export default ProjectNameSection;
