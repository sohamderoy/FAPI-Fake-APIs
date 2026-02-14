export interface ImportExportActionsProps {
  isImporting: boolean;
  currentEndpointCount: number;
  projectName: string;
  onImport: () => void;
  setSnackbar: (snackbar: {
    isOpen: boolean;
    message: string;
    backgroundColor: string;
  }) => void;
}
