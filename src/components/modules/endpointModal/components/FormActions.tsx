import { Tooltip } from "@mui/material";
import { Button } from "@/components/lib";

interface FormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  isButtonDisabled: boolean;
  buttonDisabledTooltip: string;
  onSubmit: () => void;
}

const FormActions = ({
  isEditMode,
  isSubmitting,
  isButtonDisabled,
  buttonDisabledTooltip,
  onSubmit,
}: FormActionsProps) => {
  const getButtonLabel = (): string => {
    if (isEditMode) {
      return isSubmitting ? "Updating FAPI" : "Update FAPI";
    }
    return isSubmitting ? "Creating FAPI" : "Create FAPI";
  };

  return (
    <div className="flex justify-start mt-auto pt-2">
      <Tooltip title={buttonDisabledTooltip} arrow placement="top">
        <span>
          <Button
            name={getButtonLabel()}
            disabled={isButtonDisabled}
            onClick={onSubmit}
          />
        </span>
      </Tooltip>
    </div>
  );
};

export default FormActions;
