import { useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  FAPI_LIMITS,
  STATUS_COLORS,
  IMPORT_STRATEGY,
} from "@/utils/data/global.constants";
import { importEndpoints } from "@/utils/functions/importEndpoints";
import { loadEndpoints } from "@/utils/functions/loadEndpoints";
import { hydrateEndpoints } from "@/store/slices/endpointsSlice";

interface SnackbarState {
  isOpen: boolean;
  message: string;
  backgroundColor: string;
}

interface UseEndpointImportProps {
  currentEndpointCount: number;
  setSnackbar: (snackbar: SnackbarState) => void;
}

export const useEndpointImport = ({
  currentEndpointCount,
  setSnackbar,
}: UseEndpointImportProps) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isImporting, setIsImporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [setSnackbar]
  );

  const handleImportStrategy = useCallback(
    async (strategy: "merge" | "replace") => {
      if (!pendingImportFile) return;

      // Prevent merge if at limit
      if (
        strategy === IMPORT_STRATEGY.MERGE &&
        currentEndpointCount >= FAPI_LIMITS.MAX_ENDPOINTS
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
        currentEndpointCount
      );

      if (result.success) {
        setSnackbar({
          isOpen: true,
          message:
            result.message || `Imported ${result.addedCount} endpoint(s)`,
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
    },
    [pendingImportFile, currentEndpointCount, dispatch, setSnackbar]
  );

  const handleImportCancel = useCallback(() => {
    setImportModalOpen(false);
    setPendingImportFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  return {
    fileInputRef,
    isImporting,
    importModalOpen,
    pendingImportFile,
    handleImport,
    handleFileChange,
    handleImportStrategy,
    handleImportCancel,
  };
};
