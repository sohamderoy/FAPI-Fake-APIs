import { EndpointKey, HttpMethods } from "@/types/fapi";

export const createEndpointKey = (
  method: HttpMethods,
  path: string
): EndpointKey => {
  return `${method} ${path}` as EndpointKey;
};
