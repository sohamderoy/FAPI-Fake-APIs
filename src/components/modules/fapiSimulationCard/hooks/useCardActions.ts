import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HttpMethods } from "@/types/fapi";
import { STATUS_COLORS } from "@/utils/data/global.constants";
import { updateFapiEndpoint } from "@/utils/functions/updateFapiEndpoint";
import { deleteEndpoint } from "@/utils/functions/deleteEndpoint";
import { removeEndpoint, updateEndpoint } from "@/store/slices/endpointsSlice";
import { createEndpointKey } from "@/utils/functions/createEndpointKey";

interface SnackbarState {
  isOpen: boolean;
  message: string;
  backgroundColor: string;
}

interface UseCardActionsProps {
  method: HttpMethods;
  path: string;
  initialResponseCode: number;
  initialResponseDelay: number;
}

export const useCardActions = ({
  method,
  path,
  initialResponseCode,
  initialResponseDelay,
}: UseCardActionsProps) => {
  const dispatch = useDispatch();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResponseCode, setCurrentResponseCode] =
    useState(initialResponseCode);
  const [currentResponseDelay, setCurrentResponseDelay] =
    useState(initialResponseDelay);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isOpen: false,
    message: "",
    backgroundColor: "",
  });

  // Sync local state with props when they change (e.g., after modal update)
  useEffect(() => {
    setCurrentResponseCode(initialResponseCode);
    setCurrentResponseDelay(initialResponseDelay);
  }, [initialResponseCode, initialResponseDelay]);

  // Check if changes have been made
  const hasChanges =
    currentResponseCode !== initialResponseCode ||
    currentResponseDelay !== initialResponseDelay;

  const handleCopyEndpoint = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(path);
      setSnackbar({
        isOpen: true,
        message: "Endpoint copied to clipboard",
        backgroundColor: STATUS_COLORS.SUCCESS,
      });
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "Failed to copy endpoint",
        backgroundColor: STATUS_COLORS.ERROR,
      });
    }
  }, [path]);

  const handleEditResponse = useCallback(() => {
    // Reset local state to saved values when opening modal
    // This ensures modal shows the source of truth and avoids confusion
    setCurrentResponseCode(initialResponseCode);
    setCurrentResponseDelay(initialResponseDelay);
    setShowEditModal(true);
  }, [initialResponseCode, initialResponseDelay]);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  const handleUpdateFapi = useCallback(async () => {
    if (!hasChanges) return;

    setIsSaving(true);

    try {
      const result = await updateFapiEndpoint({
        method,
        path,
        responseCode: currentResponseCode,
        responseDelay: currentResponseDelay,
      });

      if (result.success) {
        // Update Redux store
        dispatch(
          updateEndpoint({
            key: createEndpointKey(method, path),
            details: {
              responseCode: currentResponseCode,
              responseDelay: currentResponseDelay,
            },
          })
        );

        // Show success feedback
        setSnackbar({
          isOpen: true,
          message: "FAPI endpoint updated successfully",
          backgroundColor: STATUS_COLORS.SUCCESS,
        });
      } else {
        // Show error feedback
        setSnackbar({
          isOpen: true,
          message: result.error || "Failed to update endpoint",
          backgroundColor: STATUS_COLORS.ERROR,
        });

        // Reset to original values on error
        setCurrentResponseCode(initialResponseCode);
        setCurrentResponseDelay(initialResponseDelay);
      }
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "An unexpected error occurred",
        backgroundColor: STATUS_COLORS.ERROR,
      });

      // Reset to original values on error
      setCurrentResponseCode(initialResponseCode);
      setCurrentResponseDelay(initialResponseDelay);
    } finally {
      setIsSaving(false);
    }
  }, [
    method,
    path,
    currentResponseCode,
    currentResponseDelay,
    initialResponseCode,
    initialResponseDelay,
    dispatch,
    hasChanges,
  ]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleDeleteFapi = useCallback(async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);

    try {
      const result = await deleteEndpoint(method, path);

      if (result.success) {
        // Update Redux store
        dispatch(removeEndpoint(createEndpointKey(method, path)));

        // Show success feedback
        setSnackbar({
          isOpen: true,
          message: "FAPI endpoint deleted successfully",
          backgroundColor: STATUS_COLORS.SUCCESS,
        });
      } else {
        // Show error feedback
        setSnackbar({
          isOpen: true,
          message: result.error || "Failed to delete endpoint",
          backgroundColor: STATUS_COLORS.ERROR,
        });
      }
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "An unexpected error occurred",
        backgroundColor: STATUS_COLORS.ERROR,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [method, path, dispatch]);

  return {
    isDeleting,
    isSaving,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showEditModal,
    currentResponseCode,
    setCurrentResponseCode,
    currentResponseDelay,
    setCurrentResponseDelay,
    snackbar,
    setSnackbar,
    hasChanges,
    handleCopyEndpoint,
    handleEditResponse,
    handleCloseEditModal,
    handleUpdateFapi,
    handleDeleteCancel,
    handleDeleteFapi,
  };
};
