import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FAPI } from "@/utils/data";
import { ResponseControlsProps } from "./types";

const ResponseControls = ({
  currentResponseCode,
  currentResponseDelay,
  onResponseCodeChange,
  onResponseDelayChange,
}: ResponseControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 my-8">
      {/* HTTP Response Code */}
      <div className="flex-[0.65]">
        <FormControl fullWidth size="small">
          <InputLabel>HTTP Response Status Code</InputLabel>
          <Select
            value={currentResponseCode}
            onChange={(e) => onResponseCodeChange(e.target.value as number)}
            label="HTTP Response Status Code"
            className="font-googleSansFlex"
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
      </div>

      {/* Response Delay */}
      <div className="flex-[0.35]">
        <FormControl fullWidth size="small">
          <InputLabel>Delay</InputLabel>
          <Select
            value={currentResponseDelay}
            onChange={(e) => onResponseDelayChange(e.target.value as number)}
            label="Delay"
            className="font-googleSansFlex"
          >
            {Object.values(FAPI.SUPPORTED_RESPONSE_DELAYS).map((delay) => (
              <MenuItem key={delay.value} value={delay.value}>
                {delay.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default ResponseControls;
