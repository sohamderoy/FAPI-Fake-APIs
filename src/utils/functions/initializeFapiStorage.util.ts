import fs from "fs/promises";
import { getStorageDirectory } from "./getStorageDirectory.util";
import { getFapiStorageFilePathPerPort } from "./getFapiStorageFilePathPerPort.util";
import { getInitialStorage } from "./getInitialStorage.util";

export const initializeFapiStorage = async (port: string): Promise<void> => {
  /* Check if port is not valid, then return */
  if (!port?.trim()) {
    console.warn("PORT_NOT_VALID_SKIPPING_STORAGE_INITIALIZATION");
    return;
  }

  /* If port is valid the start initializing fapi storage */
  console.log("STARTING_INITIALIZE_FAPI_STORAGE");
  const fapiStorageDirectory = getStorageDirectory();

  const fapiStorageFilePathPerPort = getFapiStorageFilePathPerPort(
    fapiStorageDirectory,
    port
  );

  try {
    // Ensure directory exists
    await fs.mkdir(fapiStorageDirectory, { recursive: true });

    // Check if storage file already exists
    try {
      await fs.access(fapiStorageFilePathPerPort);
      console.log("STORAGE_FILE_EXISTS_SKIPPING_INITIALIZATION");
      return; // File exists, don't overwrite
    } catch {
      // File doesn't exist, proceed with creation
      console.log("STORAGE_FILE_NOT_FOUND_CREATING_NEW");
    }

    // Create empty storage file only if it doesn't exist
    const initialStorage = getInitialStorage();
    await fs.writeFile(
      fapiStorageFilePathPerPort,
      JSON.stringify(initialStorage, null, 2)
    );
    console.log("SUCCESS_INITIALIZING_FAPI_STORAGE");
  } catch (err) {
    console.error("ERROR_INITIALIZING_FAPI_STORAGE", err);
    throw err;
  }
};
