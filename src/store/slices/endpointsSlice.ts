import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EndpointDetails, EndpointsState } from "../types/endpoints";
import { EndpointKey, HttpMethods } from "@/types/fapi";

const initialState: EndpointsState = {
  endpoints: {},
  projectName: "",
};

const endpointsSlice = createSlice({
  name: "endpoints",
  initialState,
  reducers: {
    addEndpoint: (
      state,
      action: PayloadAction<{
        key: EndpointKey;
        details: EndpointDetails;
      }>
    ) => {
      const { key, details } = action.payload;
      state.endpoints[key] = details;
    },
    removeEndpoint: (state, action: PayloadAction<EndpointKey>) => {
      if (state.endpoints[action.payload]) {
        delete state.endpoints[action.payload];
      }
    },

    updateEndpoint: (
      state,
      action: PayloadAction<{
        key: EndpointKey;
        details: Partial<EndpointDetails>;
      }>
    ) => {
      const { key, details } = action.payload;
      if (state.endpoints[key]) {
        state.endpoints[key] = {
          ...state.endpoints[key],
          ...details,
        };
      }
    },

    hydrateEndpoints: (
      state,
      action: PayloadAction<{
        endpoints: Record<EndpointKey, EndpointDetails>;
        projectName: string;
      }>
    ) => {
      state.endpoints = action.payload.endpoints;
      state.projectName = action.payload.projectName;
    },

    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },
  },
});

export const {
  addEndpoint,
  updateEndpoint,
  removeEndpoint,
  hydrateEndpoints,
  setProjectName,
} = endpointsSlice.actions;
export default endpointsSlice.reducer;
