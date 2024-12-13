export type HttpMethods = "GET" | "POST" | "PUT" | "DELETE";

export type EndpointKey = `${HttpMethods} ${string}`;

export interface FapiEndpoint {
  id: string;
  path: string;
  method: HttpMethods;
  responseCode: number;
  responseDelay: number | 0;
  response: Record<string, any>;
  createdAt: string;
}

export interface FapiStorage {
  endpoints: Record<EndpointKey, FapiEndpoint>;
  metadata: {
    lastUpdated: string;
    totalEndpoints: number;
  };
}

export interface Fapi {
  SUPPORTED_HTTP_METHODS: {
    GET: "GET";
    PUT: "PUT";
    POST: "POST";
    DELETE: "DELETE";
  };
  SUPPORTED_HTTP_RESPONSE_STATUS_CODE: {
    OK_200: "200";
    CREATED_201: "201";
    BAD_REQUEST_400: "400";
    UNAUTHORIZED_401: "401";
    FORBIDDEN_403: "403";
    NOT_FOUND_404: "404";
    METHOD_NOT_ALLOWED_405: "405";
    INTERNAL_SERVER_ERROR_500: "500";
    SERVICE_UNAVAILABLE_503: "503";
  };
}
