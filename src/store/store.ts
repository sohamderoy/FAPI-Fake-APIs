import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./slices/navigationSlice";
import endpointsReducer from "./slices/endpointsSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    endpoints: endpointsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
