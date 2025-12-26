import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FapiEndpointBase, HttpMethods } from "@/types/fapi";
import { FAPI } from "@/utils/data/global.constants";
import { FormErrors, FormTouched } from "../types";

interface EndpointFormFieldsProps {
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

const EndpointFormFields = ({
  formData,
  formErrors,
  formTouched,
  isEditMode,
  onPathChange,
  onPathBlur,
  onMethodChange,
  onResponseCodeChange,
  onResponseDelayChange,
}: EndpointFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4">
      {/* FAPI Endpoint Path */}
      <TextField
        fullWidth
        label="FAPI Endpoint Path"
        placeholder={`/api/endpoint/paths?query="params"`}
        value={formData.path}
        onChange={(e) => onPathChange(e.target.value)}
        onBlur={onPathBlur}
        error={Boolean(formTouched.path && formErrors.path)}
        helperText={formTouched.path && formErrors.path}
        disabled={isEditMode}
        sx={{
          "& .MuiInputBase-input": {
            fontFamily: "var(--font-google-sans-code)",
          },
        }}
      ></TextField>

      {/* HTTP Method */}
      <FormControl fullWidth disabled={isEditMode}>
        <InputLabel>HTTP Method</InputLabel>
        <Select
          value={formData.method}
          label="HTTP Method"
          onChange={(e) => onMethodChange(e.target.value as HttpMethods)}
        >
          {Object.values(FAPI.SUPPORTED_HTTP_METHODS).map(
            (method: HttpMethods) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      {/* HTTP Response Code */}
      <FormControl fullWidth>
        <InputLabel>HTTP Response Status Code</InputLabel>
        <Select
          value={formData.responseCode}
          label="HTTP Response Status Code"
          onChange={(e) => onResponseCodeChange(Number(e.target.value))}
        >
          {Object.values(FAPI.SUPPORTED_HTTP_RESPONSE_STATUS_CODE).map(
            (responseCode) => (
              <MenuItem key={responseCode.code} value={responseCode.code}>
                {responseCode.label}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>

      {/* Response Delay */}
      <FormControl fullWidth>
        <InputLabel>Response Delay</InputLabel>
        <Select
          value={formData.responseDelay}
          label="Response Delay"
          onChange={(e) => onResponseDelayChange(Number(e.target.value))}
        >
          {Object.values(FAPI.SUPPORTED_RESPONSE_DELAYS).map((delay) => (
            <MenuItem key={delay.value} value={delay.value}>
              {delay.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default EndpointFormFields;
