import { initializeFapiStorage } from "./initializeFapiStorage.util";

export const initializeApp = async () => {
  const port = process.env.PORT || "3000";
  await initializeFapiStorage(port);
};
