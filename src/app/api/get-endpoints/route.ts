import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { FapiStorage } from "@/types/fapi";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";

// Force dynamic rendering - don't cache this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      console.log('[GET-ENDPOINTS] Reading from:', fapiStorageFilePathPerPort);
      const fileContent = await fs.readFile(fapiStorageFilePathPerPort, "utf-8");
      storage = JSON.parse(fileContent);
      console.log('[GET-ENDPOINTS] Loaded endpoints:', Object.keys(storage.endpoints));
      console.log('[GET-ENDPOINTS] Total endpoints:', Object.keys(storage.endpoints).length);
    } catch (err) {
      console.log('[GET-ENDPOINTS] File not found or invalid, returning empty');
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
    console.error("ERROR_FETCHING_ENDPOINTS:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
