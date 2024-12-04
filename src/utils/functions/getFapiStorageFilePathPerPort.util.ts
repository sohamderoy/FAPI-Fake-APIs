import path from "path";
import { DYNAMIC_STORAGE_PATH } from "../data/global.constants";

export const getFapiStorageFilePathPerPort = (
  fapiStorageDirectory: string,
  port: string | "3000"
) => {
  return path.join(fapiStorageDirectory, DYNAMIC_STORAGE_PATH(port));
};
