import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavigationState } from "../types/navigation";

const initialState: NavigationState = {
  hasFapiEndpoints: false,
  lastCreatedTime: null,
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setHasFapiEndpoints: (state, action: PayloadAction<boolean>) => {
      state.hasFapiEndpoints = action.payload;
      state.lastCreatedTime = action.payload ? new Date().toISOString() : null;
    },
  },
});

export const { setHasFapiEndpoints } = navigationSlice.actions;
export default navigationSlice.reducer;
