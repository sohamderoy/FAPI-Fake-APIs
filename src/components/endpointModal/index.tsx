import { useCallback, useEffect } from "react";
import { Modal, LoadingOverlay, Snackbar } from "@/lib";
import { EndpointUrlPreview } from "@/components";
import { EndpointModalProps } from "./types";
import { useEndpointForm } from "./hooks/useEndpointForm";
import { useEndpointSubmit } from "./hooks/useEndpointSubmit";
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

  // Use custom hooks
  const {
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

  // Modal close handler
  const handelModalClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
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

            {/* Response Editor */}
            <ResponseEditor
              value={formData.response}
              onChange={handleResponseChange}
            />

            {/* Form Actions */}
            <FormActions
              isEditMode={isEditMode}
              isSubmitting={isSubmittingEndpointDetails}
              isButtonDisabled={isButtonDisabled(isSubmittingEndpointDetails)}
              buttonDisabledTooltip={getButtonDisabledTooltip(
                isSubmittingEndpointDetails
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
