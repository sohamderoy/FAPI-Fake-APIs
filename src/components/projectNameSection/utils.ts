export const getTooltipTitle = (
  hasProjectNameChanges: boolean,
  projectNameError: string
): string => {
  if (hasProjectNameChanges && !projectNameError) {
    return "Save project name";
  }
  if (projectNameError) {
    return "Fix errors first";
  }
  return "No changes to save";
};
