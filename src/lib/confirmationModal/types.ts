export interface ConfirmationButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "danger" | "secondary" | "success";
  className?: string;
  disabled?: boolean;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  buttons: ConfirmationButton[];
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
}
