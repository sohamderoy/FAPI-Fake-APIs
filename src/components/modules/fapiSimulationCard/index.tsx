"use client";

import { Card, Badge, Snackbar, ConfirmationModal } from "@/lib";
import type { ConfirmationButton } from "@/lib";
import { EndpointModal } from "@/components/modules";
import { EndpointsListForFapiSimulationCard } from "./types";
import { useCardActions } from "./hooks/useCardActions";
import CardHeader from "./components/cardHeader";
import ResponseControls from "./components/responseControls";
import CardActions from "./components/cardActions";

const FapiSimulationCard = ({
  method,
  path,
  details,
}: EndpointsListForFapiSimulationCard) => {
  // Use custom hook for all card actions and state
  const {
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
  } = useCardActions({
    method,
    path,
    initialResponseCode: details.responseCode,
    initialResponseDelay: details.responseDelay,
  });

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
        <div className="h-full flex flex-col font-googleSansFlex">
          {/* Header Section with Method Badge and Path */}
          <CardHeader
            method={method}
            path={path}
            onCopyEndpoint={handleCopyEndpoint}
          />

          {/* Simulation Controls Section */}
          <ResponseControls
            currentResponseCode={currentResponseCode}
            currentResponseDelay={currentResponseDelay}
            onResponseCodeChange={setCurrentResponseCode}
            onResponseDelayChange={setCurrentResponseDelay}
          />

          {/* Action Section - Edit response, Update Fapi, Delete Fapi */}
          <CardActions
            hasChanges={hasChanges}
            isSaving={isSaving}
            isDeleting={isDeleting}
            onEditResponse={handleEditResponse}
            onUpdateFapi={handleUpdateFapi}
            onDeleteClick={() => setShowDeleteConfirm(true)}
          />
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
              <span className="font-googleSansCode text-white break-all">
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
