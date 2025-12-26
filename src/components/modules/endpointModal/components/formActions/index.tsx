import { Tooltip } from "@mui/material";
import { Button } from "@/components/lib";
import { FormActionsProps } from "./types";
import { getButtonLabel } from "./utils";

const FormActions = ({
  isEditMode,
  isSubmitting,
  isButtonDisabled,
  buttonDisabledTooltip,
  onSubmit,
}: FormActionsProps) => {
  return (
    <div className="flex justify-start mt-auto pt-2">
      <Tooltip title={buttonDisabledTooltip} arrow placement="top">
        <span>
          <Button
            name={getButtonLabel(isEditMode, isSubmitting)}
            disabled={isButtonDisabled}
            onClick={onSubmit}
          />
        </span>
      </Tooltip>
    </div>
  );
};

export default FormActions;
