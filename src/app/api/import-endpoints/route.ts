import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { FapiStorage, EndpointKey } from "@/types/fapi";
import { getStorageDirectory } from "@/utils/functions/getStorageDirectory.util";
import { getFapiStorageFilePathPerPort } from "@/utils/functions/getFapiStorageFilePathPerPort.util";
import { v4 as uuidv4 } from "uuid";

export const POST = async (req: NextRequest) => {
  try {
    const { endpoints, strategy = "merge" }: {
      endpoints: Record<EndpointKey, { responseCode: number; responseDelay: number; response: object }>;
      strategy: "merge" | "replace";
    } = await req.json();

    if (!endpoints || typeof endpoints !== "object") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid endpoints data" }),
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

    // Ensure directory exists
    await fs.mkdir(fapiStorageDirectory, { recursive: true });

    // Read existing storage or create new
    let storage: FapiStorage;
    try {
      const fileContent = await fs.readFile(fapiStorageFilePathPerPort, "utf-8");
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

    // Apply import strategy
    if (strategy === "replace") {
      storage.endpoints = {};
    }

    // Transform imported endpoints to FapiEndpoint format
    let addedCount = 0;
    let skippedCount = 0;

    Object.entries(endpoints).forEach(([key, details]) => {
      const [method, ...pathParts] = key.split(" ");
      const path = pathParts.join(" ");

      if (strategy === "merge" && storage.endpoints[key as EndpointKey]) {
        skippedCount++;
        return;
      }

      storage.endpoints[key as EndpointKey] = {
        id: uuidv4(),
        path,
        method: method as any,
        responseCode: details.responseCode,
        responseDelay: details.responseDelay,
        response: details.response,
        createdAt: new Date().toISOString(),
      };
      addedCount++;
    });

    // Update metadata
    storage.metadata = {
      lastUpdated: new Date().toISOString(),
      totalEndpoints: Object.keys(storage.endpoints).length,
    };

    // Write to disk
    await fs.writeFile(
      fapiStorageFilePathPerPort,
      JSON.stringify(storage, null, 2)
    );

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Import completed: ${addedCount} added${skippedCount > 0 ? `, ${skippedCount} skipped` : ""}`,
        addedCount,
        skippedCount,
        totalEndpoints: storage.metadata.totalEndpoints,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("ERROR_IMPORTING_ENDPOINTS:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
