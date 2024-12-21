import { FapiEndpointBase } from "@/types/fapi";

export const CREATE_FAPI_ENDPOINT_INITIAL_DATA: FapiEndpointBase = {
  path: "",
  method: "GET",
  responseCode: 200,
  responseDelay: 0,
  response: JSON.stringify({}, null, 2),
};
