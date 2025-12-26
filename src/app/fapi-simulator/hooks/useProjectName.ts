import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { FAPI_REGEX, STATUS_COLORS, UI_LIMITS } from "@/utils/data";
import { updateProjectName as updateProjectNameAPI } from "@/utils/functions";
import { setProjectName } from "@/store";

interface SnackbarState {
  isOpen: boolean;
  message: string;
  backgroundColor: string;
}

interface UseProjectNameProps {
  initialProjectName: string;
  setSnackbar: (snackbar: SnackbarState) => void;
}

export const useProjectName = ({
  initialProjectName,
  setSnackbar,
}: UseProjectNameProps) => {
  const dispatch = useDispatch();

  const [currentProjectName, setCurrentProjectName] =
    useState(initialProjectName);
  const [isSavingProjectName, setIsSavingProjectName] = useState(false);
  const [projectNameError, setProjectNameError] = useState("");

  // Check if project name has changes
  const hasProjectNameChanges = currentProjectName !== initialProjectName;

  const handleProjectNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      // Validate: only alphanumeric and spaces
      if (!FAPI_REGEX.PROJECT_NAME.test(value)) {
        setProjectNameError("Only letters, numbers, and spaces are allowed");
        return;
      }

      // Clear error if valid
      setProjectNameError("");
      setCurrentProjectName(value);
    },
    []
  );

  const handleSaveProjectName = useCallback(async () => {
    if (!hasProjectNameChanges || projectNameError) return;

    // Validate length
    if (currentProjectName.length > UI_LIMITS.PROJECT_NAME_MAX_LENGTH) {
      setProjectNameError(
        `Project name cannot exceed ${UI_LIMITS.PROJECT_NAME_MAX_LENGTH} characters`
      );
      return;
    }

    setIsSavingProjectName(true);

    try {
      const result = await updateProjectNameAPI(currentProjectName);

      if (result.success) {
        // Update Redux store
        dispatch(setProjectName(currentProjectName));

        // Show success feedback
        setSnackbar({
          isOpen: true,
          message: "Project name saved successfully",
          backgroundColor: STATUS_COLORS.SUCCESS,
        });
      } else {
        // Show error feedback
        setSnackbar({
          isOpen: true,
          message: result.error || "Failed to save project name",
          backgroundColor: STATUS_COLORS.ERROR,
        });

        // Reset to original value on error
        setCurrentProjectName(initialProjectName);
      }
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "An unexpected error occurred",
        backgroundColor: STATUS_COLORS.ERROR,
      });

      // Reset to original value on error
      setCurrentProjectName(initialProjectName);
    } finally {
      setIsSavingProjectName(false);
    }
  }, [
    hasProjectNameChanges,
    projectNameError,
    currentProjectName,
    initialProjectName,
    dispatch,
    setSnackbar,
  ]);

  return {
    currentProjectName,
    setCurrentProjectName,
    isSavingProjectName,
    projectNameError,
    hasProjectNameChanges,
    handleProjectNameChange,
    handleSaveProjectName,
  };
};
