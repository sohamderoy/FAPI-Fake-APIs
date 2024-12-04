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
