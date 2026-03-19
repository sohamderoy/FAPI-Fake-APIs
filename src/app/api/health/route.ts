import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

export const GET = async (req: NextRequest) => {
  try {
    const port = process.env.PORT || "3000";
    const fapiStorageDirectory = getStorageDirectory();
    const fapiStorageFilePathPerPort = getFapiStorageFilePathPerPort(
      fapiStorageDirectory,
      port
    );

    const fileContent = await fs.readFile(fapiStorageFilePathPerPort, "utf-8");
    const storage = JSON.parse(fileContent);
    const hasEndpoints = Object.keys(storage.endpoints).length > 0;

    return new NextResponse(
      JSON.stringify({
        success: true,
        errorMessage: null,
        hasEndpoints,
        totalEndpoints: Object.keys(storage.endpoints).length,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in checking FAPI status:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        errorMessage: "Failed to check FAPI status",
        hasEndpoints: false,
        totalEndpoints: 0,
      }),
      {
        status: 500,
      }
    );
  }
};
