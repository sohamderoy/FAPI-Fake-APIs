export const getButtonLabel = (
  isEditMode: boolean,
  isSubmitting: boolean
): string => {
  if (isEditMode) {
    return isSubmitting ? "Updating FAPI" : "Update FAPI";
  }
  return isSubmitting ? "Creating FAPI" : "Create FAPI";
};
