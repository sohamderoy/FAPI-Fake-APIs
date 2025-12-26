import { HttpMethods } from "@/types/fapi";

export const BORDER_COLOR_MAP: Record<HttpMethods, string> = {
  GET: "border-emerald-500/75",
  POST: "border-blue-500/75",
  PUT: "border-amber-500/75",
  DELETE: "border-red-500/75",
};
