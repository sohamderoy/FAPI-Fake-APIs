import { getFapiStorageFilePathPerPort } from "./../../../utils/functions/getFapiStorageFilePathPerPort.util";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { FapiStorage, HttpMethods } from "@/types/fapi";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { createEndpointKey } from "@/utils/functions/createEndpointKey";

export const POST = async (req: NextRequest) => {
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
