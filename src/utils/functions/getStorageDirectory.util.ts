import path from "path";
import { FAPI_STORAGE_FOLDER_NAME } from "../data/global.constants";

export const getStorageDirectory = () => {
  const cwd = process.cwd();
  return path.join(cwd, FAPI_STORAGE_FOLDER_NAME);
};
