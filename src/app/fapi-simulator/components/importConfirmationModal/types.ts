export interface ImportConfirmationModalProps {
  isOpen: boolean;
  fileName: string;
  isAtLimit: boolean;
  onMerge: () => void;
  onReplace: () => void;
  onCancel: () => void;
}
