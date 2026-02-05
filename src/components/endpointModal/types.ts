import { HttpMethods } from "@/types/fapi";

export interface EndpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  editData?: {
    method: HttpMethods;
    path: string;
    responseCode: number;
    responseDelay: number;
    response?: string;
  };
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
