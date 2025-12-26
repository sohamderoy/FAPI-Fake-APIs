import { FapiEndpointBase, HttpMethods } from "@/types/fapi";
import { FormErrors, FormTouched } from "../../types";

export interface EndpointFormFieldsProps {
  formData: FapiEndpointBase;
  formErrors: FormErrors;
  formTouched: FormTouched;
  isEditMode: boolean;
  onPathChange: (value: string) => void;
  onPathBlur: () => void;
  onMethodChange: (method: HttpMethods) => void;
  onResponseCodeChange: (responseCode: number) => void;
  onResponseDelayChange: (responseDelay: number) => void;
}
