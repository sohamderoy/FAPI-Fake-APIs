import path from "path";
import { FAPI_STORAGE_FOLDER_NAME } from "../data/global.constants";

export const getStorageDirectory = () => {
  // Use FAPI_USER_DIR if set (from npx start-fapi command)
  // Otherwise fallback to process.cwd() (for development with npm run dev)
  const cwd = process.env.FAPI_USER_DIR || process.cwd();
  const storagePath = path.join(cwd, FAPI_STORAGE_FOLDER_NAME);

  // Debug logging to trace storage path
  console.log('[FAPI DEBUG] Storage Directory Info:');
  console.log('  FAPI_USER_DIR:', process.env.FAPI_USER_DIR || '(not set)');
  console.log('  process.cwd():', process.cwd());
  console.log('  Final storage path:', storagePath);

  return storagePath;
};
