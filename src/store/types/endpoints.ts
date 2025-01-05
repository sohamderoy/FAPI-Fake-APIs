import { ResponseStatusCode, ResponseDelay, EndpointKey } from "@/types/fapi";

export interface EndpointDetails {
  responseCode: ResponseStatusCode["code"];
  responseDelay: ResponseDelay["value"];
}

export interface EndpointsState {
  endpoints: Record<EndpointKey, EndpointDetails>;
}
