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
} from "lucide-react";
import { useState } from "react";
import Modal from "@/components/lib/modal";
import Snackbar from "@/components/lib/snackbar";
import { deleteEndpoint } from "@/utils/functions/deleteEndpoint";
import { useDispatch } from "react-redux";
import { removeEndpoint } from "@/store/slices/endpointsSlice";
import { createEndpointKey } from "@/utils/functions/createEndpointKey";

const FapiSimulationCard = ({
  method,
  path,
  details,
}: EndpointsListForFapiSimulationCard) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    backgroundColor: "",
  });

  const handleEditResponse = () => {
    console.log("$$d1, edit response button clicked");
  };

  const handleUpdateFapi = () => {
    console.log("$$d1, update button clicked");
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
  return (
    <>
      <Card borderGradient="hover" height="md" width="full">
        <div className="h-full flex flex-col">
          {/* Header Section with Path and Method Badge */}
          <div className="flex flex-col items-start space-y-2 mb-4">
            <Tooltip title={path} arrow placement="top">
              <span className="text-gray-200 font-medium font-outfit truncate max-w-full">
                {path}
              </span>
            </Tooltip>
            <Badge method={method}></Badge>
          </div>

          {/* Simulation Controls Section */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* HTTP Response Code */}
            <div className="flex-[0.65]">
              <FormControl fullWidth size="small">
                <InputLabel>HTTP Response Status Code</InputLabel>
                <Select
                  value={details.responseCode}
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
                  value={details.responseDelay}
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
          <div className="mt-4 flex justify-between items-center">
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
                title="Update FAPI Endpoint Details"
              >
                <IconButton
                  onClick={handleUpdateFapi}
                  color="secondary"
                  disabled={true}
                >
                  <SaveIcon size={20} />
                </IconButton>
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
      <Modal
        isModalOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete FAPI Endpoint?"
        size="sm"
      >
        <div className="p-6">
          <p className="text-gray-300 mb-4">
            Are you sure you want to delete this endpoint?
          </p>
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="text-gray-400 text-sm mb-2">
              <strong className="text-gray-200">Method:</strong>{" "}
              <Badge method={method} />
            </p>
            <p className="text-gray-400 text-sm break-all">
              <strong className="text-gray-200">Path:</strong> {path}
            </p>
          </div>
          <p className="text-red-400 text-sm mb-6">
            ⚠️ This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outlined"
              onClick={() => setShowDeleteConfirm(false)}
              className="font-outfit"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteFapi}
              className="font-outfit"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

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
