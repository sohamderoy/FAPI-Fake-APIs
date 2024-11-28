import fs from "fs/promises";
import path from "path";
import {
  DYNAMIC_STORAGE_PATH,
  FAPI_STORAGE_FOLDER_NAME,
} from "./globalConstants";

const getStorageDirectory = () => {
  const cwd = process.cwd();

  return path.join(cwd, FAPI_STORAGE_FOLDER_NAME);
};

export const initializeFapiStorage = async (port: string): Promise<void> => {
  // Check if port is not valid, then return
  if (!port?.trim()) {
    console.warn("PORT_NOT_VALID_SKIPPING_STORAGE_INITIALIZATION");
    return;
  }

  // If port is valid the start initializing fapi storage
  console.log("STARTING_INITIALIZE_FAPI_STORAGE");
  const fapiStorageDirectory = getStorageDirectory();

  const fapiStorageFilePathPerPort = path.join(
    fapiStorageDirectory,
    DYNAMIC_STORAGE_PATH(port)
  );

  try {
    await fs.mkdir(fapiStorageDirectory, { recursive: true });
    await fs.unlink(fapiStorageFilePathPerPort);
  } catch (err) {
    console.log("ERR_FILE_DOES_NOT_EXIST", err);
  }

  // Create empty storage file
  await fs.writeFile(fapiStorageFilePathPerPort, JSON.stringify({}));
  console.log("SUCCESS_INITIALIZING_FAPI_STORAGE");
};
