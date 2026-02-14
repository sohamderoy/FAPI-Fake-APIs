import { useCallback, useEffect, useState } from "react";
import { Modal, LoadingOverlay, Snackbar } from "@/lib";
import { EndpointUrlPreview } from "@/components";
import { EndpointModalProps } from "./types";
import { useEndpointForm } from "./hooks/useEndpointForm";
import { useEndpointSubmit } from "./hooks/useEndpointSubmit";
import { GET_ENDPOINT_RESPONSE_API_PATH } from "@/utils/data";
import EndpointFormFields from "./subcomponents/endpointFormFields";
import ResponseEditor from "./subcomponents/responseEditor";
import FormActions from "./subcomponents/formActions";

const EndpointModal = ({
  isOpen,
  onClose,
  mode = "create",
  editData,
}: EndpointModalProps) => {
  const isEditMode = mode === "edit";

  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const [fetchResponseError, setFetchResponseError] = useState<string | null>(null);

  // Use custom hooks
  const {
    formData,
    formErrors,
    formTouched,
    isButtonDisabled,
    getButtonDisabledTooltip,
    validateForm,
    setFetchedResponse,
    handlePathChange,
    handlePathBlur,
    handleMethodChange,
    handleResponseCodeChange,
    handleResponseDelayChange,
    handleResponseChange,
    resetForm,
  } = useEndpointForm({ mode, editData });

  const {
    isSubmittingEndpointDetails,
    snackbar,
    handleCloseSnackbar,
    handleSubmitFapiDetails,
  } = useEndpointSubmit({
    mode,
    validateForm,
    onClose,
  });

  // Fetch response body on-demand when modal opens in edit mode
  const fetchEndpointResponse = useCallback(async () => {
    if (!editData) return;

    setIsFetchingResponse(true);
    setFetchResponseError(null);

    try {
      const params = new URLSearchParams({
        method: editData.method,
        path: editData.path,
      });
      const res = await fetch(`${GET_ENDPOINT_RESPONSE_API_PATH}?${params}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok) {
        setFetchResponseError(data.error || "Failed to load response data");
        return;
      }

      setFetchedResponse(
        typeof data.response === "string"
          ? data.response
          : JSON.stringify(data.response, null, 2)
      );
    } catch {
      setFetchResponseError("Failed to load response data. Please try again.");
    } finally {
      setIsFetchingResponse(false);
    }
  }, [editData, setFetchedResponse]);

  // Trigger fetch when modal opens in edit mode
  useEffect(() => {
    if (isOpen && isEditMode) {
      fetchEndpointResponse();
    }
  }, [isOpen, isEditMode, fetchEndpointResponse]);

  // Modal close handler
  const handelModalClose = useCallback(() => {
    resetForm();
    setFetchResponseError(null);
    onClose();
  }, [onClose, resetForm]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setFetchResponseError(null);
    }
  }, [isOpen, resetForm]);

  return (
    <>
      <Modal
        isModalOpen={isOpen}
        onClose={handelModalClose}
        title={
          isEditMode
            ? "Edit Fake API (FAPI) Endpoint"
            : "Create New Fake API (FAPI) Endpoint"
        }
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

          {/* Show loading overlay when fetching response data in edit mode */}
          {isFetchingResponse && (
            <LoadingOverlay overlayMessage="Loading response data..." />
          )}

          <div className="flex flex-col h-full">
            {/* Form Fields */}
            <EndpointFormFields
              formData={formData}
              formErrors={formErrors}
              formTouched={formTouched}
              isEditMode={isEditMode}
              onPathChange={handlePathChange}
              onPathBlur={handlePathBlur}
              onMethodChange={handleMethodChange}
              onResponseCodeChange={handleResponseCodeChange}
              onResponseDelayChange={handleResponseDelayChange}
            />

            {/* Endpoint URL Preview */}
            <EndpointUrlPreview path={formData.path} />

            {/* Response fetch error with retry */}
            {fetchResponseError && (
              <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center justify-between">
                <p className="text-red-400 font-googleSansFlex text-sm">
                  {fetchResponseError}
                </p>
                <button
                  onClick={fetchEndpointResponse}
                  className="ml-4 px-4 py-1.5 text-sm font-googleSansFlex text-white bg-red-700 hover:bg-red-600 rounded-md transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Response Editor */}
            <ResponseEditor
              value={formData.response}
              onChange={handleResponseChange}
            />

            {/* Form Actions */}
            <FormActions
              isEditMode={isEditMode}
              isSubmitting={isSubmittingEndpointDetails}
              isButtonDisabled={isButtonDisabled(isSubmittingEndpointDetails || isFetchingResponse)}
              buttonDisabledTooltip={getButtonDisabledTooltip(
                isSubmittingEndpointDetails || isFetchingResponse
              )}
              onSubmit={() => handleSubmitFapiDetails(formData)}
            />
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
