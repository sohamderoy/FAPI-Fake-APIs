// Barrel export for Redux store
// This file provides a single entry point for importing store slices, actions, and types

// Store
export { store } from "./store";
export type { RootState, AppDispatch } from "./store";

// Endpoint slice
export { default as endpointsReducer } from "./slices/endpointsSlice";
export {
  addEndpoint,
  removeEndpoint,
  updateEndpoint,
  hydrateEndpoints,
  setProjectName,
} from "./slices/endpointsSlice";

// Navigation slice
export { default as navigationReducer } from "./slices/navigationSlice";
export { setHasFapiEndpoints } from "./slices/navigationSlice";

// Types
export type { EndpointsState, EndpointDetails } from "./types/endpoints";
export type { NavigationState } from "./types/navigation";
