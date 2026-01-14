import { initializeFapiStorage } from "./initializeFapiStorage.util";
import packageJson from "../../../package.json";

export const initializeApp = async () => {
  // Log FAPI version
  console.log(`FAPI Version - v${packageJson.version}`);

  const port = process.env.PORT || "3000";
  await initializeFapiStorage(port);
};
