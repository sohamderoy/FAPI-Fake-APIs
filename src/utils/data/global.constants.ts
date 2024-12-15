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
    OK_200: {
      code: 200,
      label: "200 - OK",
    },
    CREATED_201: {
      code: 201,
      label: "201 - Created",
    },
    BAD_REQUEST_400: {
      code: 400,
      label: "400 - Bad Request",
    },
    UNAUTHORIZED_401: {
      code: 401,
      label: "401 - Unauthorized",
    },
    FORBIDDEN_403: {
      code: 403,
      label: "403 - Forbidden",
    },
    NOT_FOUND_404: {
      code: 404,
      label: "404 - Not Found",
    },
    METHOD_NOT_ALLOWED_405: {
      code: 405,
      label: "405 - Method Not Allowed",
    },
    INTERNAL_SERVER_ERROR_500: {
      code: 500,
      label: "500 - Internal Server Error",
    },
    SERVICE_UNAVAILABLE_503: {
      code: 503,
      label: "503 - Service Unavailable",
    },
  },
  SUPPORTED_RESPONSE_DELAYS: {
    NO_DELAY: {
      label: "0 sec",
      value: 0,
    },
    TWO_SECONDS: {
      label: "2 sec",
      value: 2000,
    },
    FIVE_SECONDS: {
      label: "5 sec",
      value: 5000,
    },
    TEN_SECONDS: {
      label: "10 sec",
      value: 10000,
    },
    TWENTY_SECONDS: {
      label: "20 sec",
      value: 20000,
    },
    SIXTY_SECONDS: {
      label: "60 sec",
      value: 60000,
    },
  },
};
