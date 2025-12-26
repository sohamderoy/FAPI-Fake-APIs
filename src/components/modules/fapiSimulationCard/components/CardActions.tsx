import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import {
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
} from "lucide-react";

interface CardActionsProps {
  hasChanges: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onEditResponse: () => void;
  onUpdateFapi: () => void;
  onDeleteClick: () => void;
}

const CardActions = ({
  hasChanges,
  isSaving,
  isDeleting,
  onEditResponse,
  onUpdateFapi,
  onDeleteClick,
}: CardActionsProps) => {
  return (
    <div className="mt-auto flex justify-between items-center">
      {/* Edit response button */}
      <Button
        startIcon={<EditIcon size={18} />}
        onClick={onEditResponse}
        className="font-googleSansFlex"
        variant="outlined"
        color="primary"
      >
        Edit Response
      </Button>

      {/* Update and Delete Fapi button group */}
      <div className="flex items-center space-x-2">
        {/* Update Fapi button */}
        <Tooltip
          arrow
          placement="top"
          title={hasChanges ? "Save changes" : "No changes to save"}
        >
          <span>
            <IconButton
              onClick={onUpdateFapi}
              color="secondary"
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <CircularProgress size={20} color="secondary" />
              ) : (
                <SaveIcon size={20} />
              )}
            </IconButton>
          </span>
        </Tooltip>

        {/* Delete Fapi Button */}
        <Tooltip arrow placement="top" title="Delete FAPI Endpoint">
          <IconButton onClick={onDeleteClick} color="error" disabled={isDeleting}>
            {isDeleting ? (
              <CircularProgress size={20} color="error" />
            ) : (
              <DeleteIcon size={20} />
            )}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default CardActions;
