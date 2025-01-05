import Card from "@/components/lib/card";
import {
  EndpointsListForFapiSimulationCard,
  FapiSimulationCardProps,
} from "./types";
import Badge from "@/components/lib/badge";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { FAPI } from "@/utils/data/global.constants";
import {
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Save as SaveIcon,
} from "lucide-react";

const FapiSimulationCard = ({
  method,
  path,
  details,
}: EndpointsListForFapiSimulationCard) => {
  const handleEditResponse = () => {
    console.log("$$d1, edit response button clicked");
  };
  const handleUpdateFapi = () => {
    console.log("$$d1, update button clicked");
  };
  const handleDeleteFapi = () => {
    console.log("$$d1, delete button clicked");
  };
  return (
    <>
      <Card borderGradient="hover" height="md" width="full">
        <div className="flex flex-col h-full">
          {/* Header Section with Method Badge and Endpoint Path */}
          <div className="flex items-center space-x-4 mb-6">
            <Badge method={method}></Badge>
            <span className="text-gray-200 font-medium font-outfit truncate">
              {path}
            </span>
          </div>

          {/* Simulation Controls Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* HTTP Response Code */}
            <div className="flex-[0.65]">
              <FormControl fullWidth size="small">
                <InputLabel>HTTP Response Status Code</InputLabel>
                <Select
                  value={details.responseCode}
                  label="HTTP Response Status Code"
                  className="font-outfit"
                >
                  {Object.values(FAPI.SUPPORTED_HTTP_RESPONSE_STATUS_CODE).map(
                    (responseCode) => (
                      <MenuItem
                        key={responseCode.code}
                        value={responseCode.code}
                      >
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
                  value={details.responseDelay}
                  label="Delay"
                  className="font-outfit"
                >
                  {Object.values(FAPI.SUPPORTED_RESPONSE_DELAYS).map(
                    (delay) => (
                      <MenuItem key={delay.value} value={delay.value}>
                        {delay.label}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Action Section - Edit response, Update Fapi, Delete Fapi */}
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800/70">
            {/* Edit response button */}
            <Button
              startIcon={<EditIcon size={18} />}
              onClick={handleEditResponse}
              className="font-outfit"
              variant="outlined"
              color="primary"
            >
              Edit Response
            </Button>

            {/* Update and Delete Fapi button group */}

            <div className="flex items-center space-x-2">
              {/* Update Fapi button */}
              <Tooltip
                arrow
                placement="top"
                title="Update FAPI Endpoint Details"
              >
                <IconButton
                  onClick={handleUpdateFapi}
                  color="secondary"
                  disabled={true}
                >
                  <SaveIcon size={20} />
                </IconButton>
              </Tooltip>

              {/* Delete Fapi Button */}
              <Tooltip arrow placement="top" title="Delete FAPI Endpoint">
                <IconButton onClick={handleDeleteFapi} color="error">
                  <DeleteIcon size={20} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default FapiSimulationCard;
