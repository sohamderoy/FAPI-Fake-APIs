export interface CreateEndpointModalProps {
  isCreateEndpointModalOpen: boolean;
  handleCloseCreateEndpointModal: () => void;
}

export interface FormErrors {
  path?: string;
}
export interface FormTouched {
  path?: boolean;
}

export interface SnackbarState {
  isOpen: boolean;
  message: string;
  backgroundColor: string;
}
