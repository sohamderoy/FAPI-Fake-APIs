import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { FapiStorage } from "@/types/fapi";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";

// Force dynamic rendering - don't cache this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = async () => {
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
    } catch {
      // File doesn't exist or is invalid - return empty export
      return new NextResponse(
        JSON.stringify({
          success: true,
          endpoints: {},
          projectName: "",
        }),
        { status: 200 }
      );
    }

    // Transform to export format (only include fields needed for import)
    const exportEndpoints: Record<string, object> = {};
    for (const [key, endpoint] of Object.entries(storage.endpoints)) {
      exportEndpoints[key] = {
        responseCode: endpoint.responseCode,
        responseDelay: endpoint.responseDelay,
        response: endpoint.response,
      };
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        endpoints: exportEndpoints,
        projectName: storage.metadata?.projectName || "",
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
    console.error("ERROR_EXPORTING_ENDPOINTS:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
