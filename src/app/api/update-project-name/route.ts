import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { FapiStorage } from "@/types/fapi";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";
import { FAPI_REGEX } from "@/utils/data/global.constants";

export const PUT = async (req: NextRequest) => {
  try {
    const port = process.env.PORT || "3000";

    if (!port?.trim()) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid Port Configuration" }),
        { status: 500 }
      );
    }

    const body = await req.json();
    const { projectName } = body;

    // Validate project name - only alphanumeric and spaces allowed
    if (projectName && !FAPI_REGEX.PROJECT_NAME.test(projectName)) {
      return new NextResponse(
        JSON.stringify({
          error: "Project name can only contain letters, numbers, and spaces",
        }),
        { status: 400 }
      );
    }

    // Limit project name length
    if (projectName && projectName.length > 50) {
      return new NextResponse(
        JSON.stringify({
          error: "Project name cannot exceed 50 characters",
        }),
        { status: 400 }
      );
    }

    const fapiStorageDirectory = getStorageDirectory();
    const fapiStorageFilePathPerPort = getFapiStorageFilePathPerPort(
      fapiStorageDirectory,
      port
    );

    // Read existing storage
    let storage: FapiStorage;
    try {
      const fileContent = await fs.readFile(
        fapiStorageFilePathPerPort,
        "utf-8"
      );
      storage = JSON.parse(fileContent);
    } catch (err) {
      return new NextResponse(
        JSON.stringify({ error: "Storage file not found" }),
        { status: 404 }
      );
    }

    // Update project name
    storage.metadata.projectName = projectName.trim();
    storage.metadata.lastUpdated = new Date().toISOString();

    // Write back to file
    await fs.writeFile(
      fapiStorageFilePathPerPort,
      JSON.stringify(storage, null, 2)
    );

    return new NextResponse(
      JSON.stringify({
        success: true,
        projectName: storage.metadata.projectName,
        message: "Project name updated successfully",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("ERROR_UPDATING_PROJECT_NAME:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
