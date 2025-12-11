export interface ConfirmationButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "danger" | "secondary" | "success";
  className?: string;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttons: ConfirmationButton[];
  onClose?: () => void;
}
