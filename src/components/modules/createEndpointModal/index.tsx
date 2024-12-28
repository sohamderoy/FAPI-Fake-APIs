import Modal from "@/components/lib/modal";
import {
  CreateEndpointModalProps,
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
} from "@mui/material";
import { useCallback, useState } from "react";
import { CREATE_FAPI_ENDPOINT_INITIAL_DATA } from "./data";
import { FapiEndpointBase, HttpMethods } from "@/types/fapi";
import { FAPI, FAPI_REGEX, STATUS_COLORS } from "@/utils/data/global.constants";
import Editor from "@/components/lib/editor";
import { createEndpoint } from "@/utils/functions/createEndpoint";
import LoadingOverlay from "@/components/lib/loadingOverlay";
import Snackbar from "@/components/lib/snackbar";

const CreateEndpointModal = ({
  isCreateEndpointModalOpen,
  handleCloseCreateEndpointModal,
}: CreateEndpointModalProps) => {
  const [formData, setFormData] = useState<FapiEndpointBase>(
    CREATE_FAPI_ENDPOINT_INITIAL_DATA
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

  const validateForm = useCallback((): boolean => {
    const pathError = validatePath(formData.path);
    setFormErrors((prev) => ({ ...prev, path: pathError }));
    return !pathError;
  }, [formData.path, validatePath]);

  const handleSubmitFapiDetails = async () => {
    console.log("$$d1, formData", JSON.stringify(formData, null, 2));

    /* Validating all fields before submission */
    const isFormValid = validateForm();

    if (!isFormValid) {
      setSnackbar({
        isOpen: true,
        message: "Please fix the validation errors before submitting",
        backgroundColor: STATUS_COLORS.ERROR,
      });

      return;
    }

    /* Try form submission */
    try {
      setIsSubmittingEndpointDetails(true);
      const result = await createEndpoint(formData);

      if (result.success) {
        setSnackbar({
          isOpen: true,
          message: "FAPI endpoint created successfully",
          backgroundColor: STATUS_COLORS.SUCCESS,
        });
        handleCloseCreateEndpointModal();
      } else {
        setSnackbar({
          isOpen: true,
          message: result.error || "Failed to create endpoint",
          backgroundColor: STATUS_COLORS.ERROR,
        });
        console.log("Failed to create endpoint:", result.error);
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

  return (
    <>
      <Modal
        isModalOpen={isCreateEndpointModalOpen}
        onClose={handleCloseCreateEndpointModal}
        title="Create New Mock API Endpoint"
        size="fullscreen"
      >
        <div className="absolute inset-0 p-6">
          {/* Show loading overlay when submitting api details */}
          {isSubmittingEndpointDetails && (
            <LoadingOverlay overlayMessage="Saving Details and Creating FAPI ..." />
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
                  className="font-outfit"
                ></TextField>

                {/* HTTP Method */}

                <FormControl fullWidth>
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
              <Button
                name={
                  isSubmittingEndpointDetails ? "Creating FAPI" : "Create FAPI"
                }
                disabled={isSubmittingEndpointDetails}
                onClick={handleSubmitFapiDetails}
              />
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
export default CreateEndpointModal;
