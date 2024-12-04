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
    await fs.mkdir(fapiStorageDirectory, { recursive: true });
    await fs.unlink(fapiStorageFilePathPerPort);
  } catch (err) {
    console.log("ERR_FILE_DOES_NOT_EXIST", err);
  }

  /* Create empty storage file */
  const initialStorage = getInitialStorage();
  await fs.writeFile(
    fapiStorageFilePathPerPort,
    JSON.stringify(initialStorage, null, 2)
  );
  console.log("SUCCESS_INITIALIZING_FAPI_STORAGE");
};
