import Modal from "@/components/lib/modal";
import {
  EndpointModalProps,
  FormErrors,
  FormTouched,
  SnackbarState,
} from "./types";
import Button from "@/components/lib/button";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { CREATE_FAPI_ENDPOINT_INITIAL_DATA } from "./data";
import { EndpointKey, FapiEndpointBase, HttpMethods } from "@/types/fapi";
import { FAPI, FAPI_REGEX, STATUS_COLORS } from "@/utils/data/global.constants";
import Editor from "@/components/lib/editor";
import { createEndpoint } from "@/utils/functions/createEndpoint";
import { updateFapiEndpoint } from "@/utils/functions/updateFapiEndpoint";
import LoadingOverlay from "@/components/lib/loadingOverlay";
import Snackbar from "@/components/lib/snackbar";
import { validateJSON } from "@/utils/functions/validateJSON";
import { useDispatch } from "react-redux";
import { setHasFapiEndpoints } from "@/store/slices/navigationSlice";
import { addEndpoint, updateEndpoint } from "@/store/slices/endpointsSlice";
import { createEndpointKey } from "@/utils/functions/createEndpointKey";

const EndpointModal = ({
  isOpen,
  onClose,
  mode = "create",
  editData,
}: EndpointModalProps) => {
  const dispatch = useDispatch();
  const isEditMode = mode === "edit";

  // Initialize form data based on mode
  const getInitialFormData = useCallback((): FapiEndpointBase => {
    if (isEditMode && editData) {
      return {
        path: editData.path,
        method: editData.method as HttpMethods,
        responseCode: editData.responseCode,
        responseDelay: editData.responseDelay,
        response: JSON.stringify(editData.response, null, 2),
      };
    }
    return CREATE_FAPI_ENDPOINT_INITIAL_DATA;
  }, [isEditMode, editData]);

  const [formData, setFormData] = useState<FapiEndpointBase>(() =>
    getInitialFormData()
  );

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formTouched, setFormTouched] = useState<FormTouched>({});

  const [isSubmittingEndpointDetails, setIsSubmittingEndpointDetails] =
    useState<boolean>(false);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isOpen: false,
    message: "",
    backgroundColor: "",
  });

  const validatePath = useCallback((path: string): string | undefined => {
    if (!path.trim()) return "Endpoint path is required";
    if (!path.startsWith("/")) return "Endpoint path must start with /";
    if (path.length < 2) return "Endpoint path must have at least 2 characters";
    if (!FAPI_REGEX.ENDPOINT_PATH.test(path))
      return "Invalid characters in path. Allowed: letters, numbers, and the following special characters: / - _ ? & = ' \" % space";
    return undefined;
  }, []);

  const handleResponseChange = (value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      response: value || JSON.stringify({}, null, 2),
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  // Check if any changes have been made in edit mode
  const hasChanges = useCallback((): boolean => {
    if (!isEditMode || !editData) return true; // In create mode, always allow submission

    // Compare current form data with original edit data
    const responseChanged = formData.response !== JSON.stringify(editData.response, null, 2);
    const responseCodeChanged = formData.responseCode !== editData.responseCode;
    const responseDelayChanged = formData.responseDelay !== editData.responseDelay;

    return responseChanged || responseCodeChanged || responseDelayChanged;
  }, [isEditMode, editData, formData]);

  // Check if the button should be disabled
  const isButtonDisabled = useCallback((): boolean => {
    // Always disable during submission
    if (isSubmittingEndpointDetails) return true;

    // Check if JSON is valid
    const jsonValidation = validateJSON(formData.response);
    if (!jsonValidation.isValid) return true;

    // In create mode, check if path is valid
    if (!isEditMode) {
      const pathError = validatePath(formData.path);
      if (pathError) return true;
    }

    // In edit mode, check if there are changes
    if (isEditMode && !hasChanges()) return true;

    return false;
  }, [
    isSubmittingEndpointDetails,
    formData.response,
    formData.path,
    isEditMode,
    hasChanges,
    validatePath,
  ]);

  // Get the tooltip message explaining why button is disabled
  const getButtonDisabledTooltip = useCallback((): string => {
    if (isSubmittingEndpointDetails) return "";

    const jsonValidation = validateJSON(formData.response);
    if (!jsonValidation.isValid) {
      return `Invalid JSON: ${jsonValidation.error}`;
    }

    if (!isEditMode) {
      const pathError = validatePath(formData.path);
      if (pathError) return pathError;
    }

    if (isEditMode && !hasChanges()) {
      return "No changes to save";
    }

    return "";
  }, [
    isSubmittingEndpointDetails,
    formData.response,
    formData.path,
    isEditMode,
    hasChanges,
    validatePath,
  ]);

  const validateForm = useCallback((): boolean => {
    const pathError = validatePath(formData.path);
    setFormErrors((prev) => ({ ...prev, path: pathError }));
    return !pathError;
  }, [formData.path, validatePath]);

  const handleSubmitFapiDetails = async () => {
    /* Validate JSON Response */
    const jsonValidation = validateJSON(formData.response);

    if (!jsonValidation.isValid) {
      setSnackbar({
        isOpen: true,
        message: `Invalid JSON in response: ${jsonValidation.error}`,
        backgroundColor: STATUS_COLORS.ERROR,
      });

      return;
    }

    /* Validating all fields before submission (skip path validation in edit mode) */
    if (!isEditMode) {
      const isFormValid = validateForm();

      if (!isFormValid) {
        setSnackbar({
          isOpen: true,
          message: "Please fix the validation errors before submitting",
          backgroundColor: STATUS_COLORS.ERROR,
        });

        return;
      }
    }

    /* Try form submission */
    try {
      setIsSubmittingEndpointDetails(true);

      if (isEditMode) {
        // Update existing endpoint
        const parsedResponse = JSON.parse(formData.response);
        const result = await updateFapiEndpoint({
          method: formData.method,
          path: formData.path,
          response: parsedResponse,
          responseCode: formData.responseCode,
          responseDelay: formData.responseDelay,
        });

        if (result.success) {
          setSnackbar({
            isOpen: true,
            message: "FAPI endpoint updated successfully",
            backgroundColor: STATUS_COLORS.SUCCESS,
          });

          // Update Redux store
          dispatch(
            updateEndpoint({
              key: createEndpointKey(formData.method, formData.path),
              details: {
                response: parsedResponse,
                responseCode: formData.responseCode,
                responseDelay: formData.responseDelay,
              },
            })
          );

          onClose();
        } else {
          setSnackbar({
            isOpen: true,
            message: result.error || "Failed to update endpoint",
            backgroundColor: STATUS_COLORS.ERROR,
          });
        }
      } else {
        // Create new endpoint
        const result = await createEndpoint(formData);
        dispatch(setHasFapiEndpoints(true));

        if (result.success) {
          setSnackbar({
            isOpen: true,
            message: "FAPI endpoint created successfully",
            backgroundColor: STATUS_COLORS.SUCCESS,
          });
          try {
            dispatch(
              addEndpoint({
                key: `${result?.endpoint?.method} ${result?.endpoint?.path}` as EndpointKey,
                details: {
                  responseCode: result?.endpoint?.responseCode as number,
                  responseDelay: result?.endpoint?.responseDelay as number,
                  response: (result?.endpoint?.response || {}) as object,
                },
              })
            );
          } catch (err) {
            console.log("Error saving details to redux");
          } finally {
            onClose();
          }
        } else {
          setSnackbar({
            isOpen: true,
            message: result.error || "Failed to create endpoint",
            backgroundColor: STATUS_COLORS.ERROR,
          });
          console.log("Failed to create endpoint:", result.error);
        }
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      setSnackbar({
        isOpen: true,
        message: "An unexpected error occurred",
        backgroundColor: STATUS_COLORS.ERROR,
      });
    } finally {
      setIsSubmittingEndpointDetails(false);
    }
  };

  const handlePathChange = (value: string) => {
    setFormData((prev) => ({ ...prev, path: value }));
    if (formTouched.path) {
      setFormErrors((prev) => ({
        ...prev,
        path: validatePath(value),
      }));
    }
  };

  const handlePathBlur = () => {
    setFormTouched((prev) => ({ ...prev, path: true }));
    setFormErrors((prev) => ({
      ...prev,
      path: validatePath(formData.path),
    }));
  };

  const resetModalState = useCallback(() => {
    setFormData(getInitialFormData());
    setFormErrors({});
    setFormTouched({});
    setIsSubmittingEndpointDetails(false);
  }, [getInitialFormData]);

  const handelModalClose = useCallback(() => {
    resetModalState();
    onClose();
  }, [onClose, resetModalState]);

  useEffect(() => {
    if (!isOpen) {
      resetModalState();
    }
  }, [isOpen, resetModalState]);

  return (
    <>
      <Modal
        isModalOpen={isOpen}
        onClose={handelModalClose}
        title={isEditMode ? "Edit Mock API Endpoint" : "Create New Mock API Endpoint"}
        size="fullscreen"
      >
        <div className="absolute inset-0 p-6">
          {/* Show loading overlay when submitting api details */}
          {isSubmittingEndpointDetails && (
            <LoadingOverlay
              overlayMessage={
                isEditMode
                  ? "Updating FAPI Endpoint..."
                  : "Saving Details and Creating FAPI ..."
              }
            />
          )}

          <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4">
              <>
                {/* FAPI Endpoint Path */}

                <TextField
                  fullWidth
                  label="FAPI Endpoint Path"
                  placeholder={`/api/endpoint/paths?query="params"`}
                  value={formData.path}
                  onChange={(e) => handlePathChange(e.target.value)}
                  onBlur={handlePathBlur}
                  error={Boolean(formTouched.path && formErrors.path)}
                  helperText={formTouched.path && formErrors.path}
                  disabled={isEditMode}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontFamily: 'var(--font-jetbrains-mono)',
                    },
                  }}
                ></TextField>

                {/* HTTP Method */}

                <FormControl fullWidth disabled={isEditMode}>
                  <InputLabel>HTTP Method</InputLabel>
                  <Select
                    value={formData.method}
                    label="HTTP Method"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        method: e.target.value as HttpMethods,
                      })
                    }
                  >
                    {Object.values(FAPI.SUPPORTED_HTTP_METHODS).map(
                      (method: HttpMethods) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>

                {/* HTTP Response Code */}

                <FormControl fullWidth>
                  <InputLabel>HTTP Response Status Code</InputLabel>
                  <Select
                    value={formData.responseCode}
                    label="HTTP Response Status Code"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responseCode: Number(e.target.value),
                      })
                    }
                  >
                    {Object.values(
                      FAPI.SUPPORTED_HTTP_RESPONSE_STATUS_CODE
                    ).map((responseCode) => (
                      <MenuItem
                        key={responseCode.code}
                        value={responseCode.code}
                      >
                        {responseCode.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Response Delay */}

                <FormControl fullWidth>
                  <InputLabel>Response Delay</InputLabel>
                  <Select
                    value={formData.responseDelay}
                    label="Response Delay"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responseDelay: Number(e.target.value),
                      })
                    }
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

                {/* Actual Response */}
              </>
            </div>

            {/* Editor Section */}

            <div className="flex-1 min-h-0 mb-8">
              <p className="text-gray-300 mb-2 text-sm">Response Body (JSON)</p>
              <div className="h-[calc(100%-40px)]">
                <Editor
                  value={formData.response}
                  onChange={handleResponseChange}
                />
              </div>
            </div>

            <div className="flex justify-start mt-auto pt-2">
              <Tooltip
                title={getButtonDisabledTooltip()}
                arrow
                placement="top"
              >
                <span>
                  <Button
                    name={
                      isEditMode
                        ? isSubmittingEndpointDetails
                          ? "Updating FAPI"
                          : "Update FAPI"
                        : isSubmittingEndpointDetails
                        ? "Creating FAPI"
                        : "Create FAPI"
                    }
                    disabled={isButtonDisabled()}
                    onClick={handleSubmitFapiDetails}
                  />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </Modal>

      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        onClose={handleCloseSnackbar}
        backgroundColor={snackbar.backgroundColor}
      />
    </>
  );
};
export default EndpointModal;
