import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { FapiStorage, HttpMethods } from "@/types/fapi";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";
import { createEndpointKey } from "@/utils/functions";

// Force dynamic rendering - don't cache this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const method = searchParams.get("method") as HttpMethods | null;
    const path = searchParams.get("path");

    if (!method || !path) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing Required Query Parameters: method and path",
        }),
        { status: 400 }
      );
    }

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

    let storage: FapiStorage;
    try {
      const fileContent = await fs.readFile(fapiStorageFilePathPerPort, "utf-8");
      storage = JSON.parse(fileContent);
    } catch {
      return new NextResponse(
        JSON.stringify({ error: "Storage File Not Found" }),
        { status: 404 }
      );
    }

    const endpointKey = createEndpointKey(method, path);
    const endpoint = storage.endpoints[endpointKey];

    if (!endpoint) {
      return new NextResponse(
        JSON.stringify({ error: "Endpoint Not Found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        response: endpoint.response,
      }),
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (err) {
    console.error("ERROR_FETCHING_ENDPOINT_RESPONSE:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
