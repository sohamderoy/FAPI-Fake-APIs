export interface FormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  isButtonDisabled: boolean;
  buttonDisabledTooltip: string;
  onSubmit: () => void;
}
