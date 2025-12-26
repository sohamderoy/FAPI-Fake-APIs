import { useState } from "react";
import { useDispatch } from "react-redux";
import { EndpointKey, FapiEndpointBase } from "@/types/fapi";
import { STATUS_COLORS } from "@/utils/data/global.constants";
import { validateJSON } from "@/utils/functions/validateJSON";
import { createEndpoint } from "@/utils/functions/createEndpoint";
import { updateFapiEndpoint } from "@/utils/functions/updateFapiEndpoint";
import { setHasFapiEndpoints } from "@/store/slices/navigationSlice";
import { addEndpoint, updateEndpoint } from "@/store/slices/endpointsSlice";
import { createEndpointKey } from "@/utils/functions/createEndpointKey";
import { SnackbarState } from "../types";

interface UseEndpointSubmitProps {
  mode: "create" | "edit";
  validateForm: () => boolean;
  onClose: () => void;
}

export const useEndpointSubmit = ({
  mode,
  validateForm,
  onClose,
}: UseEndpointSubmitProps) => {
  const dispatch = useDispatch();
  const isEditMode = mode === "edit";

  const [isSubmittingEndpointDetails, setIsSubmittingEndpointDetails] =
    useState<boolean>(false);

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isOpen: false,
    message: "",
    backgroundColor: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSubmitFapiDetails = async (formData: FapiEndpointBase) => {
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
                  response: (result?.endpoint?.response || "") as string,
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

  return {
    isSubmittingEndpointDetails,
    snackbar,
    handleCloseSnackbar,
    handleSubmitFapiDetails,
  };
};
