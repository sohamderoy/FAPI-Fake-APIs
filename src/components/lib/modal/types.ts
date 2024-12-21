export interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  children: React.ReactElement;
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
  title: string;
  showCloseButton?: boolean;
  footer?: React.ReactElement;
}
