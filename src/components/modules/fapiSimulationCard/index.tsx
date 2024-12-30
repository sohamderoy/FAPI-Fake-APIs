import Card from "@/components/lib/card";
import { FapiSimulationCardProps } from "./types";
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

const FapiSimulationCard = ({ endpoint }: FapiSimulationCardProps) => {
  const mockEndpoint = endpoint || {
    id: "1",
    path: "/api/users/dfsdfasdfsdfasdfafasfs",
    method: "GET",
    responseCode: 200,
    responseDelay: 0,
    response: {},
    createdAt: new Date().toISOString(),
  };

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
      <Card borderGradient="hover" height="md">
        <div className="flex flex-col h-full">
          {/* Header Section with Method Badge and Endpoint Path */}
          <div className="flex items-center space-x-4 mb-6">
            <Badge method={mockEndpoint.method}></Badge>
            <span className="text-gray-200 font-medium font-outfit truncate">
              {mockEndpoint?.path}
            </span>
          </div>

          {/* Simulation Controls Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* HTTP Response Code */}
            <FormControl fullWidth size="small">
              <InputLabel>HTTP Response Status Code</InputLabel>
              <Select
                value={mockEndpoint.responseCode}
                label="HTTP Response Status Code"
                className="font-outfit"
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
            <FormControl fullWidth size="small">
              <InputLabel>Response Delay</InputLabel>
              <Select
                value={mockEndpoint.responseDelay}
                label="Response Delay"
                className="font-outfit"
              >
                {Object.values(FAPI.SUPPORTED_RESPONSE_DELAYS).map((delay) => (
                  <MenuItem key={delay.value} value={delay.value}>
                    {delay.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Action Section - Edit response, Update Fapi, Delete Fapi */}
          <div className="flex justify-between items-center mt-auto">
            {/* Edit response button */}
            <Button
              startIcon={<EditIcon size={18} />}
              onClick={handleEditResponse}
              className="font-outfit"
              variant="outlined"
              color="warning"
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
                <IconButton onClick={handleUpdateFapi} color="primary">
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
