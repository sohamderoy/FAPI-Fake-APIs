"use client";

import Button from "@/components/lib/button";
import SpeedDial from "@/components/lib/speedDial";
import { SpeedDialAction } from "@/components/lib/speedDial/types";
import EndpointModal from "@/components/modules/endpointModal";
import FapiSimulationCard from "@/components/modules/fapiSimulationCard";
import { EndpointsListForFapiSimulationCard } from "@/components/modules/fapiSimulationCard/types";
import { RootState } from "@/store/store";
import { HttpMethods } from "@/types/fapi";
import { PlusCircle, Upload, Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  hydrateEndpoints,
  setProjectName,
} from "@/store/slices/endpointsSlice";
import { loadEndpoints } from "@/utils/functions/loadEndpoints";
import { exportEndpoints } from "@/utils/functions/exportEndpoints";
import { importEndpoints } from "@/utils/functions/importEndpoints";
import Snackbar from "@/components/lib/snackbar";
import ConfirmationModal from "@/components/lib/confirmationModal";
import { ConfirmationButton } from "@/components/lib/confirmationModal/types";
import {
  STATUS_COLORS,
  FAPI_REGEX,
  IMPORT_STRATEGY,
  FAPI_LIMITS,
} from "@/utils/data/global.constants";
import { updateProjectName } from "@/utils/functions/updateProjectName";
import {
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { Save as SaveIcon } from "lucide-react";

const FAPI_SPEED_DIAL_ACTIONS: SpeedDialAction[] = [
  {
    icon: PlusCircle,
    name: "Create FAPI",
    action: "create",
  },
  {
    icon: Download,
    name: "Export FAPI Details",
    action: "export",
  },
  {
    icon: Upload,
    name: "Import FAPI Details",
    action: "import",
  },
];

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  // Project name state
  const [currentProjectName, setCurrentProjectName] = useState(projectName);
  const [isSavingProjectName, setIsSavingProjectName] = useState(false);
  const [projectNameError, setProjectNameError] = useState("");

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

  // Sync local project name state with Redux
  useEffect(() => {
    setCurrentProjectName(projectName);
  }, [projectName]);

  const endpointsList: EndpointsListForFapiSimulationCard[] = Object.entries(
    endpoints
  ).map(([key, details]) => {
    const [method, ...pathParts] = key.split(" ");
    return {
      path: pathParts.join(" "),
      method: method as HttpMethods,
      details,
    };
  });

  // Check if project name has changes
  const hasProjectNameChanges = currentProjectName !== projectName;

  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    // Validate: only alphanumeric and spaces
    if (!FAPI_REGEX.PROJECT_NAME.test(value)) {
      setProjectNameError("Only letters, numbers, and spaces are allowed");
      return;
    }

    // Clear error if valid
    setProjectNameError("");
    setCurrentProjectName(value);
  };

  const handleSaveProjectName = async () => {
    if (!hasProjectNameChanges || projectNameError) return;

    // Validate length
    if (currentProjectName.length > 50) {
      setProjectNameError("Project name cannot exceed 50 characters");
      return;
    }

    setIsSavingProjectName(true);

    try {
      const result = await updateProjectName(currentProjectName);

      if (result.success) {
        // Update Redux store
        dispatch(setProjectName(currentProjectName));

        // Show success feedback
        setSnackbar({
          isOpen: true,
          message: "Project name saved successfully",
          backgroundColor: STATUS_COLORS.SUCCESS,
        });
      } else {
        // Show error feedback
        setSnackbar({
          isOpen: true,
          message: result.error || "Failed to save project name",
          backgroundColor: STATUS_COLORS.ERROR,
        });

        // Reset to original value on error
        setCurrentProjectName(projectName);
      }
    } catch (error) {
      setSnackbar({
        isOpen: true,
        message: "An unexpected error occurred",
        backgroundColor: STATUS_COLORS.ERROR,
      });

      // Reset to original value on error
      setCurrentProjectName(projectName);
    } finally {
      setIsSavingProjectName(false);
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size before showing modal
    if (file.size > FAPI_LIMITS.MAX_FILE_SIZE_BYTES) {
      setSnackbar({
        isOpen: true,
        message: `File size exceeds ${FAPI_LIMITS.MAX_FILE_SIZE_MB}MB limit`,
        backgroundColor: STATUS_COLORS.ERROR,
      });
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Store the file and show confirmation modal
    setPendingImportFile(file);
    setImportModalOpen(true);
  };

  const handleImportStrategy = async (strategy: "merge" | "replace") => {
    if (!pendingImportFile) return;

    // Prevent merge if at limit
    const currentCount = Object.keys(endpoints).length;
    if (
      strategy === IMPORT_STRATEGY.MERGE &&
      currentCount >= FAPI_LIMITS.MAX_ENDPOINTS
    ) {
      setSnackbar({
        isOpen: true,
        message: `Cannot merge: Already at maximum limit of ${FAPI_LIMITS.MAX_ENDPOINTS} endpoints`,
        backgroundColor: STATUS_COLORS.ERROR,
      });
      setImportModalOpen(false);
      return;
    }

    setImportModalOpen(false);
    setIsImporting(true);

    const result = await importEndpoints(
      pendingImportFile,
      strategy,
      currentCount
    );

    if (result.success) {
      setSnackbar({
        isOpen: true,
        message: result.message || `Imported ${result.addedCount} endpoint(s)`,
        backgroundColor: STATUS_COLORS.SUCCESS,
      });

      // Reload endpoints from disk
      const reloadResult = await loadEndpoints();
      if (reloadResult.success && reloadResult.endpoints) {
        dispatch(
          hydrateEndpoints({
            endpoints: reloadResult.endpoints,
            projectName: reloadResult.projectName || "",
          })
        );
      }
    } else {
      setSnackbar({
        isOpen: true,
        message: result.error || "Failed to import endpoints",
        backgroundColor: STATUS_COLORS.ERROR,
      });
    }

    setIsImporting(false);
    setPendingImportFile(null);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImportCancel = () => {
    setImportModalOpen(false);
    setPendingImportFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Check if at limit for disabling Merge option
  const currentEndpointCount = Object.keys(endpoints).length;
  const isAtLimit = currentEndpointCount >= FAPI_LIMITS.MAX_ENDPOINTS;

  const importConfirmationButtons: ConfirmationButton[] = [
    {
      label: "Cancel",
      onClick: handleImportCancel,
      variant: "secondary",
    },
    {
      label: "Merge",
      onClick: isAtLimit ? () => {} : () => handleImportStrategy(IMPORT_STRATEGY.MERGE),
      variant: "primary",
      className: isAtLimit
        ? "flex-1 px-4 py-3 text-gray-400 font-medium rounded-lg bg-gray-700 cursor-not-allowed opacity-60"
        : undefined,
    },
    {
      label: "Replace All",
      onClick: () => handleImportStrategy(IMPORT_STRATEGY.REPLACE),
      variant: "danger",
    },
  ];

  const handleSpeedDialAction = (action: string) => {
    switch (action) {
      case "create":
        handleOpenCreateEndpointModal();
        break;
      case "export":
        if (Object.keys(endpoints).length === 0) {
          setSnackbar({
            isOpen: true,
            message: "No endpoints to export",
            backgroundColor: STATUS_COLORS.ERROR,
          });
        } else {
          exportEndpoints(endpoints, projectName);
          setSnackbar({
            isOpen: true,
            message: `Successfully exported ${
              Object.keys(endpoints).length
            } endpoint(s)`,
            backgroundColor: STATUS_COLORS.SUCCESS,
          });
        }
        break;
      case "import":
        handleImport();
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-black via-gray-900 to-black p-6">
      <div className="backdrop-blur-3xl bg-black/20 min-h-screen fixed inset-0 -z-10" />

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: "none" }}
      />

      <div className="max-w-[1440px] mx-auto">
        {/* Header Section - Title and Create FAPI Button*/}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-outfit">
            FAPI Simulator
          </h1>
          <Tooltip
            title={
              isAtLimit
                ? `Maximum limit of ${FAPI_LIMITS.MAX_ENDPOINTS} endpoints reached`
                : "Create a new FAPI endpoint"
            }
            arrow
            placement="left"
          >
            <span>
              <Button
                onClick={isAtLimit ? undefined : handleOpenCreateEndpointModal}
                name="Create New FAPI"
                disabled={isAtLimit}
              ></Button>
            </span>
          </Tooltip>
        </div>

        {/* Project Name Section */}
        <div className="mb-4 flex items-start gap-2">
          <div className="flex-1 max-w-lg">
            <TextField
              fullWidth
              size="small"
              label="Add the name of you project that FAPI is supporting (Optional)"
              value={currentProjectName}
              onChange={handleProjectNameChange}
              error={!!projectNameError}
              helperText={projectNameError}
              placeholder="e.g., The Next Big Web Application"
              className="font-outfit"
              InputProps={{
                className: "font-outfit",
              }}
              inputProps={{
                maxLength: 50,
              }}
            />
          </div>
          <Tooltip
            arrow
            placement="top"
            title={
              hasProjectNameChanges && !projectNameError
                ? "Save project name"
                : projectNameError
                ? "Fix errors first"
                : "No changes to save"
            }
          >
            <span>
              <IconButton
                onClick={handleSaveProjectName}
                color="secondary"
                disabled={
                  !hasProjectNameChanges ||
                  !!projectNameError ||
                  isSavingProjectName
                }
                size="small"
              >
                {isSavingProjectName ? (
                  <CircularProgress size={20} color="secondary" />
                ) : (
                  <SaveIcon size={20} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </div>

        {/* FAPI Counter Display */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg">
            <span className="text-sm text-gray-400 font-outfit">
              Endpoints:
            </span>
            <span className="text-lg font-semibold text-white font-outfit">
              {currentEndpointCount}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-lg font-semibold text-gray-400 font-outfit">
              {FAPI_LIMITS.MAX_ENDPOINTS}
            </span>
            {currentEndpointCount >= FAPI_LIMITS.MAX_ENDPOINTS && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-600/20 text-red-400 rounded border border-red-600/30">
                Max FAPI Creation Limit Reached
              </span>
            )}
          </div>
        </div>

        {/* FAPI Simulation Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {endpointsList.map((endpoint, index) => (
            <FapiSimulationCard
              key={index}
              method={endpoint.method}
              path={endpoint.path}
              details={endpoint.details}
            ></FapiSimulationCard>
          ))}
        </div>
      </div>

      {/* Speed Dial */}
      <SpeedDial
        actions={FAPI_SPEED_DIAL_ACTIONS}
        onActionClick={handleSpeedDialAction}
      ></SpeedDial>

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
      <ConfirmationModal
        isOpen={importModalOpen}
        title="Choose Import Strategy"
        message={`You are about to import endpoints from:\n${
          pendingImportFile?.name || "unknown file"
        }\n\nHow would you like to proceed?\n\n• Merge: Keep existing endpoints, add new ones (skip duplicates)\n• Replace All: Delete all existing endpoints and import fresh`}
        buttons={importConfirmationButtons}
        onClose={handleImportCancel}
      />
    </div>
  );
};

export default FapiSimulatorPage;
