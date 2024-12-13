import { Fapi } from "@/types/fapi";

export const FAPI_STORAGE_FOLDER_NAME = ".fapi-storage";
export const DYNAMIC_STORAGE_PATH = (port: string) =>
  `fapi-endpoints-${port}.json`;
export const FAPI: Fapi = {
  SUPPORTED_HTTP_METHODS: {
    GET: "GET",
    PUT: "PUT",
    POST: "POST",
    DELETE: "DELETE",
  },
  SUPPORTED_HTTP_RESPONSE_STATUS_CODE: {
    OK_200: "200",
    CREATED_201: "201",
    BAD_REQUEST_400: "400",
    UNAUTHORIZED_401: "401",
    FORBIDDEN_403: "403",
    NOT_FOUND_404: "404",
    METHOD_NOT_ALLOWED_405: "405",
    INTERNAL_SERVER_ERROR_500: "500",
    SERVICE_UNAVAILABLE_503: "503",
  },
};
