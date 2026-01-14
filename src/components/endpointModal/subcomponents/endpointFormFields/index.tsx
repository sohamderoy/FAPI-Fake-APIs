import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { HttpMethods } from "@/types/fapi";
import { FAPI } from "@/utils/data";
import { EndpointFormFieldsProps } from "./types";

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
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-6 mb-4">
      {/* FAPI Endpoint Path - Takes up 3 columns (50%) */}
      <div className="lg:col-span-3">
        <TextField
          fullWidth
          label="Enter FAPI Endpoint Path"
          placeholder={`FAPI Endpoint Path eg.: /api/hello-world/path?key=value_1,value_2`}
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
      </div>

      {/* HTTP Method - Takes up 1 column */}
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

      {/* HTTP Response Code - Takes up 1 column */}
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

      {/* Response Delay - Takes up 1 column */}
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
