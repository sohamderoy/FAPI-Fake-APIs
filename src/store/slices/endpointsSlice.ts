import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EndpointDetails, EndpointsState } from "../types/endpoints";
import { EndpointKey, HttpMethods } from "@/types/fapi";

const initialState: EndpointsState = {
  endpoints: {},
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
      console.log("$$t1", action.payload, key, details);
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
  },
});

export const { addEndpoint, updateEndpoint, removeEndpoint } =
  endpointsSlice.actions;
export default endpointsSlice.reducer;
