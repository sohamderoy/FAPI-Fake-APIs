import { FapiStorage } from "@/types/fapi";

export const getInitialStorage = (): FapiStorage => {
  return {
    endpoints: {},
    metadata: {
      lastUpdated: new Date().toISOString(),
      totalEndpoints: 0,
      projectName: "",
    },
  };
};
