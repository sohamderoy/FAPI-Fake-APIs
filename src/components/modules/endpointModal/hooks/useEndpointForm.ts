import { useCallback, useState } from "react";
import { FapiEndpointBase, HttpMethods } from "@/types/fapi";
import { CREATE_FAPI_ENDPOINT_INITIAL_DATA } from "../data";
import { FAPI_REGEX } from "@/utils/data/global.constants";
import { FormErrors, FormTouched } from "../types";
import { validateJSON } from "@/utils/functions/validateJSON";

interface UseEndpointFormProps {
  mode: "create" | "edit";
  editData?: {
    method: HttpMethods;
    path: string;
    responseCode: number;
    responseDelay: number;
    response: string;
  };
}

export const useEndpointForm = ({ mode, editData }: UseEndpointFormProps) => {
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

  // Path validation
  const validatePath = useCallback((path: string): string | undefined => {
    if (!path.trim()) return "Endpoint path is required";
    if (!path.startsWith("/")) return "Endpoint path must start with /";
    if (path.length < 2) return "Endpoint path must have at least 2 characters";
    if (!FAPI_REGEX.ENDPOINT_PATH.test(path))
      return "Invalid characters in path. Allowed: letters, numbers, and the following special characters: / - _ ? & = , ' \" % space";
    return undefined;
  }, []);

  // Check if any changes have been made in edit mode
  const hasChanges = useCallback((): boolean => {
    if (!isEditMode || !editData) return true; // In create mode, always allow submission

    // Compare current form data with original edit data
    const responseChanged =
      formData.response !== JSON.stringify(editData.response, null, 2);
    const responseCodeChanged = formData.responseCode !== editData.responseCode;
    const responseDelayChanged =
      formData.responseDelay !== editData.responseDelay;

    return responseChanged || responseCodeChanged || responseDelayChanged;
  }, [isEditMode, editData, formData]);

  // Check if the button should be disabled
  const isButtonDisabled = useCallback(
    (isSubmitting: boolean): boolean => {
      // Always disable during submission
      if (isSubmitting) return true;

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
    },
    [formData.response, formData.path, isEditMode, hasChanges, validatePath]
  );

  // Get the tooltip message explaining why button is disabled
  const getButtonDisabledTooltip = useCallback(
    (isSubmitting: boolean): string => {
      if (isSubmitting) return "";

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
    },
    [formData.response, formData.path, isEditMode, hasChanges, validatePath]
  );

  // Validate the form
  const validateForm = useCallback((): boolean => {
    const pathError = validatePath(formData.path);
    setFormErrors((prev) => ({ ...prev, path: pathError }));
    return !pathError;
  }, [formData.path, validatePath]);

  // Field change handlers
  const handlePathChange = useCallback(
    (value: string) => {
      setFormData((prev) => ({ ...prev, path: value }));
      if (formTouched.path) {
        setFormErrors((prev) => ({
          ...prev,
          path: validatePath(value),
        }));
      }
    },
    [formTouched.path, validatePath]
  );

  const handlePathBlur = useCallback(() => {
    setFormTouched((prev) => ({ ...prev, path: true }));
    setFormErrors((prev) => ({
      ...prev,
      path: validatePath(formData.path),
    }));
  }, [formData.path, validatePath]);

  const handleMethodChange = useCallback((method: HttpMethods) => {
    setFormData((prev) => ({ ...prev, method }));
  }, []);

  const handleResponseCodeChange = useCallback((responseCode: number) => {
    setFormData((prev) => ({ ...prev, responseCode }));
  }, []);

  const handleResponseDelayChange = useCallback((responseDelay: number) => {
    setFormData((prev) => ({ ...prev, responseDelay }));
  }, []);

  const handleResponseChange = useCallback((value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      response: value || JSON.stringify({}, null, 2),
    }));
  }, []);

  // Reset form state
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setFormErrors({});
    setFormTouched({});
  }, [getInitialFormData]);

  return {
    formData,
    formErrors,
    formTouched,
    isButtonDisabled,
    getButtonDisabledTooltip,
    validateForm,
    handlePathChange,
    handlePathBlur,
    handleMethodChange,
    handleResponseCodeChange,
    handleResponseDelayChange,
    handleResponseChange,
    resetForm,
  };
};
