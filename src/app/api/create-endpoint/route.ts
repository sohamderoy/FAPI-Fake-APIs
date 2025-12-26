import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import { FapiEndpoint, FapiStorage } from "@/types/fapi";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { createEndpointKey } from "@/utils/functions";

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
      response: data.response || "",
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
