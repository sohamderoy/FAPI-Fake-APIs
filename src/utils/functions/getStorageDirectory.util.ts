import path from "path";
import { FAPI_STORAGE_FOLDER_NAME } from "../data/global.constants";

export const getStorageDirectory = () => {
  // Use FAPI_USER_DIR if set (from npx start-fapi command)
  // Otherwise fallback to process.cwd() (for development with npm run dev)
  const cwd = process.env.FAPI_USER_DIR || process.cwd();
  return path.join(cwd, FAPI_STORAGE_FOLDER_NAME);
};
