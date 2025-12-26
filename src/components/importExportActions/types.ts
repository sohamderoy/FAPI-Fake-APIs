import { EndpointKey } from "@/types/fapi";
import type { EndpointDetails } from "@/store";

export interface ImportExportActionsProps {
  isImporting: boolean;
  currentEndpointCount: number;
  endpoints: Record<EndpointKey, EndpointDetails>;
  projectName: string;
  onImport: () => void;
  setSnackbar: (snackbar: {
    isOpen: boolean;
    message: string;
    backgroundColor: string;
  }) => void;
}
