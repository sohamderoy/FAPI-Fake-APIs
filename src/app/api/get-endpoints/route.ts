import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { FapiStorage } from "@/types/fapi";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";

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

    return new NextResponse(
      JSON.stringify({
        success: true,
        endpoints: storage.endpoints,
        metadata: storage.metadata,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("ERROR_FETCHING_ENDPOINTS:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
