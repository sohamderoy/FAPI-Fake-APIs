"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "@mui/material";
import {
  EndpointModal,
  FapiSimulationCard,
  ProjectNameSection,
  EndpointStats,
  ImportExportActions,
  ImportConfirmationModal,
} from "@/components";
import type { EndpointsListForFapiSimulationCard } from "@/components";
import {
  AnimatedBackground,
  AppName,
  Button,
  PrivacyBanner,
  Snackbar,
} from "@/lib";
import type { RootState } from "@/store";
import { hydrateEndpoints } from "@/store";
import { HttpMethods } from "@/types/fapi";
import { loadEndpoints, createEndpointKey } from "@/utils/functions";
import { FAPI_LIMITS, UI_LIMITS, IMPORT_STRATEGY } from "@/utils/data";
import { useProjectName } from "./hooks/useProjectName";
import { useEndpointImport } from "./hooks/useEndpointImport";

const FapiSimulatorPage = () => {
  const dispatch = useDispatch();
  const endpoints = useSelector(
    (state: RootState) => state.endpoints.endpoints
  );
  const projectName = useSelector(
    (state: RootState) => state.endpoints.projectName
  );

  const [isCreateEndpointModalOpen, setIsCreateEndpointModalOpen] =
    useState<boolean>(false);
  const handleOpenCreateEndpointModal = () =>
    setIsCreateEndpointModalOpen(true);
  const handleCloseCreateEndpointModal = () =>
    setIsCreateEndpointModalOpen(false);

  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    backgroundColor: "",
  });

  // Hydrate endpoints from disk on page load
  useEffect(() => {
    const hydrateStore = async () => {
      const result = await loadEndpoints();
      if (result.success && result.endpoints) {
        dispatch(
          hydrateEndpoints({
            endpoints: result.endpoints,
            projectName: result.projectName || "",
          })
        );
      } else {
        console.error("Failed to load endpoints:", result.error);
      }
    };

    hydrateStore();
  }, [dispatch]);

  // Use custom hooks
  const {
    currentProjectName,
    setCurrentProjectName,
    isSavingProjectName,
    projectNameError,
    hasProjectNameChanges,
    handleProjectNameChange,
    handleSaveProjectName,
  } = useProjectName({
    initialProjectName: projectName,
    setSnackbar,
  });

  const {
    fileInputRef,
    isImporting,
    importModalOpen,
    pendingImportFile,
    handleImport,
    handleFileChange,
    handleImportStrategy,
    handleImportCancel,
  } = useEndpointImport({
    currentEndpointCount: Object.keys(endpoints).length,
    setSnackbar,
  });

  // Sync local project name state with Redux
  useEffect(() => {
    setCurrentProjectName(projectName);
  }, [projectName, setCurrentProjectName]);

  const endpointsList: EndpointsListForFapiSimulationCard[] = useMemo(
    () =>
      Object.entries(endpoints).map(([key, details]) => {
        const [method, ...pathParts] = key.split(" ");
        return {
          path: pathParts.join(" "),
          method: method as HttpMethods,
          details,
        };
      }),
    [endpoints]
  );

  // Check if at limit for disabling Create and Merge options
  const currentEndpointCount = Object.keys(endpoints).length;
  const isAtLimit = currentEndpointCount >= FAPI_LIMITS.MAX_ENDPOINTS;

  return (
    <div className="min-h-screen relative p-6 overflow-hidden">
      <AnimatedBackground />

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: "none" }}
      />

      <div
        className="mx-auto"
        style={{ maxWidth: UI_LIMITS.UI_CONTAINER_MAX_WIDTH }}
      >
        {/* Header Section - Title and Action Buttons*/}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <AppName style={{ fontSize: "3rem", fontWeight: "bold" }} />
          <div className="flex items-center gap-2">
            {/* Create New FAPI Button */}
            <Tooltip
              title={
                isAtLimit
                  ? `Maximum limit of ${FAPI_LIMITS.MAX_ENDPOINTS} endpoints reached`
                  : "Create a new FAPI endpoint"
              }
              arrow
              placement="top"
            >
              <span>
                <Button
                  onClick={
                    isAtLimit ? undefined : handleOpenCreateEndpointModal
                  }
                  name="Create a new FAPI"
                  disabled={isAtLimit}
                />
              </span>
            </Tooltip>

            {/* Import/Export Actions */}
            <ImportExportActions
              isImporting={isImporting}
              currentEndpointCount={currentEndpointCount}
              endpoints={endpoints}
              projectName={projectName}
              onImport={handleImport}
              setSnackbar={setSnackbar}
            />
          </div>
        </div>

        {/* Project Name and FAPI Counter Section */}
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          {/* Project Name - Left */}
          <ProjectNameSection
            currentProjectName={currentProjectName}
            projectNameError={projectNameError}
            hasProjectNameChanges={hasProjectNameChanges}
            isSavingProjectName={isSavingProjectName}
            onProjectNameChange={handleProjectNameChange}
            onSaveProjectName={handleSaveProjectName}
          />

          {/* FAPI Counter - Right */}
          <EndpointStats currentEndpointCount={currentEndpointCount} />
        </div>

        {/* Privacy Banner */}
        <div className="mb-8">
          <PrivacyBanner />
        </div>

        {/* FAPI Simulation Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-7">
          {endpointsList.map((endpoint) => (
            <FapiSimulationCard
              key={createEndpointKey(endpoint.method, endpoint.path)}
              method={endpoint.method}
              path={endpoint.path}
              details={endpoint.details}
            ></FapiSimulationCard>
          ))}
        </div>
      </div>

      <EndpointModal
        isOpen={isCreateEndpointModalOpen}
        onClose={handleCloseCreateEndpointModal}
      ></EndpointModal>

      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
        backgroundColor={snackbar.backgroundColor}
      />

      {/* Import Strategy Confirmation Modal */}
      <ImportConfirmationModal
        isOpen={importModalOpen}
        fileName={pendingImportFile?.name || "unknown file"}
        isAtLimit={isAtLimit}
        onMerge={() => handleImportStrategy(IMPORT_STRATEGY.MERGE)}
        onReplace={() => handleImportStrategy(IMPORT_STRATEGY.REPLACE)}
        onCancel={handleImportCancel}
      />
    </div>
  );
};

export default FapiSimulatorPage;
