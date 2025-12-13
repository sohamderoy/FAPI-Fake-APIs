"use client";

import Card from "@/components/lib/card";
import {
  EndpointsListForFapiSimulationCard,
  FapiSimulationCardProps,
} from "./types";
import Badge from "@/components/lib/badge";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { FAPI, STATUS_COLORS } from "@/utils/data/global.constants";
import {
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
  Copy as CopyIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import Snackbar from "@/components/lib/snackbar";
import ConfirmationModal from "@/components/lib/confirmationModal";
import { ConfirmationButton } from "@/components/lib/confirmationModal/types";
import EndpointModal from "@/components/modules/endpointModal";
import { deleteEndpoint } from "@/utils/functions/deleteEndpoint";
import { useDispatch } from "react-redux";
import { removeEndpoint, updateEndpoint } from "@/store/slices/endpointsSlice";
import { createEndpointKey } from "@/utils/functions/createEndpointKey";
import { updateFapiEndpoint } from "@/utils/functions/updateFapiEndpoint";

const FapiSimulationCard = ({
  method,
  path,
  details,
}: EndpointsListForFapiSimulationCard) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentResponseCode, setCurrentResponseCode] = useState(
    details.responseCode
  );
  const [currentResponseDelay, setCurrentResponseDelay] = useState(
    details.responseDelay
  );
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    backgroundColor: "",
  });

  // Map method to border color
  const borderColorMap = {
    GET: "border-emerald-500/75",
    POST: "border-blue-500/75",
    PUT: "border-amber-500/75",
    DELETE: "border-red-500/75",
  };

  const handleCopyEndpoint = async () => {
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
  };

  const handleEditResponse = () => {
    // Reset local state to saved values when opening modal
    // This ensures modal shows the source of truth and avoids confusion
    setCurrentResponseCode(details.responseCode);
    setCurrentResponseDelay(details.responseDelay);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Sync local state with details prop when it changes (e.g., after modal update)
  useEffect(() => {
    setCurrentResponseCode(details.responseCode);
    setCurrentResponseDelay(details.responseDelay);
  }, [details.responseCode, details.responseDelay]);

  // Check if changes have been made
  const hasChanges =
    currentResponseCode !== details.responseCode ||
    currentResponseDelay !== details.responseDelay;

  const handleUpdateFapi = async () => {
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
        setCurrentResponseCode(details.responseCode);
        setCurrentResponseDelay(details.responseDelay);
      }
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "An unexpected error occurred",
        backgroundColor: STATUS_COLORS.ERROR,
      });

      // Reset to original values on error
      setCurrentResponseCode(details.responseCode);
      setCurrentResponseDelay(details.responseDelay);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleDeleteFapi = async () => {
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
  };

  const deleteConfirmationButtons: ConfirmationButton[] = [
    {
      label: "Cancel",
      onClick: handleDeleteCancel,
      variant: "secondary",
    },
    {
      label: "Yes, Delete",
      onClick: handleDeleteFapi,
      variant: "danger",
    },
  ];
  return (
    <>
      <Card borderGradient="hover" height="full" width="full">
        <div className="h-full flex flex-col">
          {/* Header Section with Method Badge and Path */}
          <div className="flex items-center justify-between gap-2 w-full min-w-0">
            <div
              className={`flex items-center gap-2 bg-black px-2 py-1 rounded-md border min-w-0 ${borderColorMap[method]}`}
            >
              <Tooltip title={path} arrow placement="top">
                <span className="text-base font-semibold truncate text-white font-jetbrains block min-w-0">
                  {path}
                </span>
              </Tooltip>
              <Tooltip title="Copy endpoint" arrow placement="top">
                <button
                  onClick={handleCopyEndpoint}
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                  <CopyIcon size={14} className="text-gray-400" />
                </button>
              </Tooltip>
            </div>
            <Badge method={method}></Badge>
          </div>

          {/* Simulation Controls Section */}
          <div className="flex flex-col md:flex-row gap-4 my-8">
            {/* HTTP Response Code */}
            <div className="flex-[0.65]">
              <FormControl fullWidth size="small">
                <InputLabel>HTTP Response Status Code</InputLabel>
                <Select
                  value={currentResponseCode}
                  onChange={(e) =>
                    setCurrentResponseCode(e.target.value as number)
                  }
                  label="HTTP Response Status Code"
                  className="font-outfit"
                >
                  {Object.values(FAPI.SUPPORTED_HTTP_RESPONSE_STATUS_CODE).map(
                    (responseCode) => (
                      <MenuItem
                        key={responseCode.code}
                        value={responseCode.code}
                      >
                        {responseCode.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </div>

            {/* Response Delay */}
            <div className="flex-[0.35]">
              <FormControl fullWidth size="small">
                <InputLabel>Delay</InputLabel>
                <Select
                  value={currentResponseDelay}
                  onChange={(e) =>
                    setCurrentResponseDelay(e.target.value as number)
                  }
                  label="Delay"
                  className="font-outfit"
                >
                  {Object.values(FAPI.SUPPORTED_RESPONSE_DELAYS).map(
                    (delay) => (
                      <MenuItem key={delay.value} value={delay.value}>
                        {delay.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Action Section - Edit response, Update Fapi, Delete Fapi */}
          <div className="mt-auto flex justify-between items-center">
            {/* Edit response button */}
            <Button
              startIcon={<EditIcon size={18} />}
              onClick={handleEditResponse}
              className="font-outfit"
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
                    onClick={handleUpdateFapi}
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
                <IconButton
                  onClick={() => setShowDeleteConfirm(true)}
                  color="error"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <CircularProgress size={20} color="error" />
                  ) : (
                    <DeleteIcon size={20} />
                  )}
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete FAPI Endpoint?"
        message={
          <div className="space-y-4">
            <p>Are you sure you want to delete this endpoint?</p>
            <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded-md border border-gray-700">
              <Badge method={method} />
              <span className="font-jetbrains text-white break-all">
                {path}
              </span>
            </div>
            <p className="text-red-400">⚠️ This action cannot be undone.</p>
          </div>
        }
        buttons={deleteConfirmationButtons}
        onClose={handleDeleteCancel}
      />

      {/* Edit Endpoint Modal */}
      <EndpointModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        mode="edit"
        editData={{
          method,
          path,
          responseCode: details.responseCode,
          responseDelay: details.responseDelay,
          response: details.response,
        }}
      />

      {/* Snackbar for feedback */}
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
        backgroundColor={snackbar.backgroundColor}
      />
    </>
  );
};

export default FapiSimulationCard;
