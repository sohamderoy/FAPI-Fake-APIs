import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import { FapiEndpoint, FapiStorage, HttpMethods } from "@/types/fapi";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { createEndpointKey } from "@/utils/functions";

// Force dynamic rendering - don't cache this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* GET /api/endpoints - Fetch all endpoints */
export const GET = async (req: NextRequest) => {
  try {
    const port = process.env.PORT || "3000";

    if (!port?.trim()) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid Port Configuration" }),
        { status: 500 }
      );
    }

    const fapiStorageDirectory = getStorageDirectory();
    const fapiStorageFilePathPerPort = getFapiStorageFilePathPerPort(
      fapiStorageDirectory,
      port
    );

    // Read storage file
    let storage: FapiStorage;
    try {
      const fileContent = await fs.readFile(fapiStorageFilePathPerPort, "utf-8");
      storage = JSON.parse(fileContent);
    } catch (err) {
      // File doesn't exist or is invalid - return empty storage
      return new NextResponse(
        JSON.stringify({
          success: true,
          endpoints: {},
          metadata: {
            lastUpdated: new Date().toISOString(),
            totalEndpoints: 0,
          },
        }),
        { status: 200 }
      );
    }

    // Strip response bodies to keep the listing payload lightweight
    const endpointsWithoutResponses: Record<string, object> = {};
    for (const [key, endpoint] of Object.entries(storage.endpoints)) {
      const { response, ...rest } = endpoint;
      endpointsWithoutResponses[key] = rest;
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        endpoints: endpointsWithoutResponses,
        metadata: storage.metadata,
      }),
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err) {
    console.error("ERROR_FETCHING_ENDPOINTS:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};

/* POST /api/endpoints - Create a new endpoint */
export const POST = async (req: NextRequest) => {
  try {
    const data = (await req.json()) as FapiEndpoint;
    const port = process.env.PORT || "3000";
    const fapiStorageDirectory = getStorageDirectory();
    const fapiStorageFilePathPerPort = getFapiStorageFilePathPerPort(
      fapiStorageDirectory,
      port
    );

    /* Check if port is not valid, then return */
    if (!port?.trim()) {
      console.warn("PORT_NOT_VALID_SKIPPING_STORAGE_INITIALIZATION");
      return;
    }

    /* Checking if the req contains required fields */
    if (!data.path || !data.method || !data.responseCode) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing Required Fields",
        }),
        {
          status: 400,
        }
      );
    }

    /* Create storage directory if it does not exist */
    await fs.mkdir(fapiStorageDirectory, { recursive: true });

    /* Read existing storage if available or initialize a new one */
    let storage: FapiStorage;
    try {
      const fileContent = await fs.readFile(
        fapiStorageFilePathPerPort,
        "utf-8"
      );
      storage = JSON.parse(fileContent);
    } catch {
      storage = {
        endpoints: {},
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalEndpoints: 0,
        },
      };
    }

    const endpointKey = createEndpointKey(data.method, data.path);

    /* Adding the new endpoint in the storage and updating metadata */
    storage.endpoints[endpointKey] = {
      id: uuidv4(),
      path: data.path,
      method: data.method,
      responseCode: data.responseCode,
      responseDelay: data.responseDelay || 0,
      response: data.response ?? "",
      createdAt: new Date().toISOString(),
    };
    storage.metadata = {
      lastUpdated: new Date().toISOString(),
      totalEndpoints: Object.keys(storage.endpoints).length,
    };

    /* Saving the new endpoint to storage along with any previous data */
    await fs.writeFile(
      fapiStorageFilePathPerPort,
      JSON.stringify(storage, null, 2)
    );

    return new NextResponse(
      JSON.stringify(
        {
          success: true,
          message: "Endpoint Successfully Created With Following Details",
          endpoint: storage.endpoints[endpointKey],
        },
        null,
        2
      )
    );
  } catch (err) {
    console.log("ERROR_CREATING_ENDPOINT: ", err);
    return new NextResponse(
      JSON.stringify({
        err: "Internal Server Error",
      }),
      {
        status: 500,
      }
    );
  }
};

/* PUT /api/endpoints - Update an existing endpoint */
export const PUT = async (req: NextRequest) => {
  try {
    const {
      method,
      path,
      response,
      responseCode,
      responseDelay,
    }: {
      method: HttpMethods;
      path: string;
      response?: string;
      responseCode?: number;
      responseDelay?: number;
    } = await req.json();

    /* Check if required fields are present */
    if (!method || !path) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing Required Fields (method and path)",
        }),
        {
          status: 400,
        }
      );
    }

    /* Check if at least one field to update is provided */
    if (
      response === undefined &&
      responseCode === undefined &&
      responseDelay === undefined
    ) {
      return new NextResponse(
        JSON.stringify({
          error:
            "At least one field to update must be provided (response, responseCode, or responseDelay)",
        }),
        {
          status: 400,
        }
      );
    }

    const port = process.env.PORT || "3000";
    const fapiStorageDirectory = getStorageDirectory();
    const fapiStorageFilePathPerPort = getFapiStorageFilePathPerPort(
      fapiStorageDirectory,
      port
    );

    /* Check if port is valid */
    if (!port?.trim()) {
      console.warn("PORT_NOT_VALID_CANNOT_UPDATE_ENDPOINT");
      return new NextResponse(
        JSON.stringify({
          error: "Invalid Port Configuration",
        }),
        {
          status: 500,
        }
      );
    }

    /* Read existing storage */
    let storage: FapiStorage;
    try {
      const fileContent = await fs.readFile(
        fapiStorageFilePathPerPort,
        "utf-8"
      );
      storage = JSON.parse(fileContent);
    } catch {
      return new NextResponse(
        JSON.stringify({
          error: "Storage File Not Found",
        }),
        {
          status: 404,
        }
      );
    }

    /* Generate endpoint key and check if endpoint exists */
    const endpointKey = createEndpointKey(method, path);

    if (!storage.endpoints[endpointKey]) {
      return new NextResponse(
        JSON.stringify({
          error: "Endpoint Not Found",
        }),
        {
          status: 404,
        }
      );
    }

    /* Update the endpoint with provided fields */
    const updatedEndpoint = {
      ...storage.endpoints[endpointKey],
      ...(response !== undefined && { response }),
      ...(responseCode !== undefined && { responseCode }),
      ...(responseDelay !== undefined && { responseDelay }),
    };

    storage.endpoints[endpointKey] = updatedEndpoint;

    /* Update metadata */
    storage.metadata = {
      lastUpdated: new Date().toISOString(),
      totalEndpoints: Object.keys(storage.endpoints).length,
    };

    /* Write updated storage back to file */
    await fs.writeFile(
      fapiStorageFilePathPerPort,
      JSON.stringify(storage, null, 2)
    );

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Endpoint Updated Successfully",
        updatedEndpoint: storage.endpoints[endpointKey],
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("ERROR_UPDATING_ENDPOINT: ", err);
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

/* DELETE /api/endpoints - Delete an endpoint */
export const DELETE = async (req: NextRequest) => {
  try {
    const { method, path }: { method: HttpMethods; path: string } =
      await req.json();

    /* Check if required fields are present */
    if (!method || !path) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing Required Fields",
        }),
        {
          status: 400,
        }
      );
    }

    const port = process.env.PORT || "3000";
    const fapiStorageDirectory = getStorageDirectory();
    const fapiStorageFilePathPerPort = getFapiStorageFilePathPerPort(
      fapiStorageDirectory,
      port
    );

    /* Check if port is valid */
    if (!port?.trim()) {
      console.warn("PORT_NOT_VALID_CANNOT_DELETE_ENDPOINT");
      return new NextResponse(
        JSON.stringify({
          error: "Invalid Port Configuration",
        }),
        {
          status: 500,
        }
      );
    }

    /* Read existing storage */
    let storage: FapiStorage;
    try {
      const fileContent = await fs.readFile(
        fapiStorageFilePathPerPort,
        "utf-8"
      );
      storage = JSON.parse(fileContent);
    } catch {
      return new NextResponse(
        JSON.stringify({
          error: "Storage File Not Found",
        }),
        {
          status: 404,
        }
      );
    }

    /* Generate endpoint key and check if endpoint exists */
    const endpointKey = createEndpointKey(method, path);

    if (!storage.endpoints[endpointKey]) {
      return new NextResponse(
        JSON.stringify({
          error: "Endpoint Not Found",
        }),
        {
          status: 404,
        }
      );
    }

    /* Delete the endpoint from storage */
    delete storage.endpoints[endpointKey];

    /* Update metadata */
    storage.metadata = {
      lastUpdated: new Date().toISOString(),
      totalEndpoints: Object.keys(storage.endpoints).length,
    };

    /* Write updated storage back to file */
    await fs.writeFile(
      fapiStorageFilePathPerPort,
      JSON.stringify(storage, null, 2)
    );

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Endpoint Successfully Deleted",
        deletedEndpoint: { method, path },
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("ERROR_DELETING_ENDPOINT: ", err);
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
