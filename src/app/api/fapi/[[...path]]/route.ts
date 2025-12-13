import { FapiEndpoint, HttpMethods } from "@/types/fapi";
import { FAPI } from "@/utils/data/global.constants";
import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { createEndpointKey } from "@/utils/functions/createEndpointKey";

const normalizeQueryString = (url: URL): string => {
  const searchParams = new URLSearchParams(url.search);
  const sortedParams: [string, string][] = [];

  /* Collecting all parameters */
  searchParams.forEach((value, key) => {
    sortedParams.push([key, value]);
  });

  /* Sort params by key for consistent query params ordering */
  sortedParams.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  /* Rebuilding query string */
  const normalizedParams = new URLSearchParams();

  sortedParams.forEach(([key, value]) => {
    normalizedParams.append(key, value);
  });

  const queryString = normalizedParams.toString();

  console.log(
    "$$w1, url: ",
    url,
    "searchParams: ",
    searchParams,
    "sortedParams: ",
    sortedParams,
    "normalizedParams: ",
    normalizedParams,
    "queryString: ",
    queryString
  );
  return queryString ? `${queryString}` : "";
};
const delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
const createMethodHandler = (method: HttpMethods) => {
  return async (
    req: NextRequest,
    { params }: { params: { path?: string[] } }
  ) => {
    try {
      const port = process.env.PORT || "3000";
      const pathSegments = params.path || [];
      const requestPath = `/${pathSegments.join("/")}`;

      /* Normalize query paths */
      const url = new URL(req.url);
      const normalizedQueryString = normalizeQueryString(url);

      /* Try exact match with normalized query parameters first */
      const requestPathWithQuery = normalizedQueryString
        ? `${requestPath}${normalizedQueryString}`
        : requestPath;

      /* Getting fapi storage file path */
      const fapiStorageDirectory = getStorageDirectory();
      const fapiStorageFilePathPerPort = getFapiStorageFilePathPerPort(
        fapiStorageDirectory,
        port
      );

      /* Reading storage file */
      let storage;

      try {
        const fileContent = await fs.readFile(
          fapiStorageFilePathPerPort,
          "utf8"
        );
        storage = JSON.parse(fileContent);
      } catch (err) {
        console.error("Error reading storage file: ", err);
        return new NextResponse(
          JSON.stringify({ error: "Internal Server Error" }),
          {
            status: 500,
          }
        );
      }

      /* Try to match the endpoint with query params first*/
      let endpointKey = createEndpointKey(method, requestPathWithQuery);
      let endpoint: FapiEndpoint | undefined = storage.endpoints[endpointKey];

      /* If no exact match found with query params  */
      if (!endpoint && normalizedQueryString) {
        /* Look through all the endpoints for a potential match with normalized query params */
        const entries = Object.entries(storage.endpoints) as Array<
          [string, FapiEndpoint]
        >;
        const matchingEndpoint = entries.find(([key, ep]) => {
          if (!key.startsWith(`${method} ${requestPath}?`)) return false;

          const endpointUrl = new URL(`http://localhost${ep.path}`);
          const endpointNormalizedQuery = normalizeQueryString(endpointUrl);
          return endpointNormalizedQuery === normalizedQueryString;
        });

        if (matchingEndpoint) {
          endpoint = matchingEndpoint[1];
        } else {
          /* If no match with query param is found then try the base path*/
          endpointKey = createEndpointKey(method, requestPath);
          endpoint = storage.endpoints[endpointKey];
        }
      }

      /* Send 404 Not Found Error if Endpoint Not Found */
      if (!endpoint) {
        return new NextResponse(
          JSON.stringify({
            error: "FAPI Endpoint Not Found",
          }),
          { status: 404 }
        );
      }

      /* Apply delay configured by user before sending the response */
      if (endpoint.responseDelay > 0) {
        await delay(endpoint.responseDelay);
      }

      /* Return configured response set by user */
      return new NextResponse(JSON.stringify(endpoint.response), {
        status: endpoint.responseCode,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(`Error in ${method} handler: `, err);
      return new NextResponse(
        JSON.stringify({
          error: "Internal Server Error",
        }),
        {
          status: 500,
        }
      );
    }
  };
};

/* Create handlers for supported HTTP methods */
export const GET = createMethodHandler(FAPI.SUPPORTED_HTTP_METHODS.GET);
export const POST = createMethodHandler(FAPI.SUPPORTED_HTTP_METHODS.POST);
export const PUT = createMethodHandler(FAPI.SUPPORTED_HTTP_METHODS.PUT);
export const DELETE = createMethodHandler(FAPI.SUPPORTED_HTTP_METHODS.DELETE);
