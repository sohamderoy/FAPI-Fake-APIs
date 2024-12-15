export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE";

export type EndpointKey = `${HttpMethods} ${string}`;
export interface FapiEndpointBase {
  path: string;
  method: HttpMethods;
  responseCode: number;
  responseDelay: number | 0;
  response: Record<string, any> | string;
}
export interface FapiEndpoint extends FapiEndpointBase {
  id: string;
  createdAt: string;
}

export interface FapiStorage {
  endpoints: Record<EndpointKey, FapiEndpoint>;
  metadata: {
    lastUpdated: string;
    totalEndpoints: number;
  };
}

export interface ResponseDelay {
  label: string;
  value: number;
}

export interface ResponseStatusCode {
  code: number;
  label: string;
}
export interface Fapi {
  SUPPORTED_HTTP_METHODS: {
    GET: "GET";
    PUT: "PUT";
    POST: "POST";
    DELETE: "DELETE";
  };
  SUPPORTED_HTTP_RESPONSE_STATUS_CODE: {
    OK_200: ResponseStatusCode;
    CREATED_201: ResponseStatusCode;
    BAD_REQUEST_400: ResponseStatusCode;
    UNAUTHORIZED_401: ResponseStatusCode;
    FORBIDDEN_403: ResponseStatusCode;
    NOT_FOUND_404: ResponseStatusCode;
    METHOD_NOT_ALLOWED_405: ResponseStatusCode;
    INTERNAL_SERVER_ERROR_500: ResponseStatusCode;
    SERVICE_UNAVAILABLE_503: ResponseStatusCode;
  };
  SUPPORTED_RESPONSE_DELAYS: {
    NO_DELAY: ResponseDelay;
    TWO_SECONDS: ResponseDelay;
    FIVE_SECONDS: ResponseDelay;
    TEN_SECONDS: ResponseDelay;
    TWENTY_SECONDS: ResponseDelay;
    SIXTY_SECONDS: ResponseDelay;
  };
}
