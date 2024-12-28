export interface SnackbarProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  autoHideDuration?: number;
  backgroundColor?: string;
}
