import Modal from "@/components/lib/modal";
import { CreateEndpointModalProps } from "./types";
import Button from "@/components/lib/button";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { CREATE_FAPI_ENDPOINT_INITIAL_DATA } from "./data";
import { FapiEndpointBase, HttpMethods } from "@/types/fapi";
import { FAPI } from "@/utils/data/global.constants";
import Editor from "@/components/lib/editor";

const CreateEndpointModal = ({
  isCreateEndpointModalOpen,
  handleCloseCreateEndpointModal,
}: CreateEndpointModalProps) => {
  const [formData, setFormData] = useState<FapiEndpointBase>(
    CREATE_FAPI_ENDPOINT_INITIAL_DATA
  );

  const handleResponseChange = (value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      response: value || JSON.stringify({}, null, 2),
    }));
  };
  const handleSubmitFapiDetails = () => {
    console.log("$$d1, formData", JSON.stringify(formData, null, 2));
  };
  const modalFooter = (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <Button name="Create FAPI" onClick={handleSubmitFapiDetails}></Button>
    </div>
  );
  return (
    <Modal
      isModalOpen={isCreateEndpointModalOpen}
      onClose={handleCloseCreateEndpointModal}
      title="Create New Mock API Endpoint"
      size="fullscreen"
      footer={modalFooter}
    >
      <div className="flex flex-col space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <>
            {/* FAPI Endpoint Path */}

            <TextField
              fullWidth
              label="FAPI Endpoint Path"
              placeholder="/api/your-endpoint"
              value={formData.path}
              onChange={(e) =>
                setFormData({ ...formData, path: e.target.value })
              }
              className="font-outfit"
            ></TextField>

            {/* HTTP Method */}

            <FormControl fullWidth>
              <InputLabel>HTTP Method</InputLabel>
              <Select
                value={formData.method}
                label="HTTP Method"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    method: e.target.value as HttpMethods,
                  })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responseCode: Number(e.target.value),
                  })
                }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responseDelay: Number(e.target.value),
                  })
                }
              >
                {Object.values(FAPI.SUPPORTED_RESPONSE_DELAYS).map((delay) => (
                  <MenuItem key={delay.value} value={delay.value}>
                    {delay.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Actual Response */}
          </>
        </div>

        {/* Editor Section */}

        <div className="w-full">
          <p className="text-gray-300 mb-2 text-sm">Response Body (JSON)</p>
          <Editor value={formData.response} onChange={handleResponseChange} />
        </div>
      </div>
    </Modal>
  );
};
export default CreateEndpointModal;
