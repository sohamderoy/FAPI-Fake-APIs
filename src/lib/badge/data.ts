import { HttpMethods } from "@/types/fapi";

type BadgeColors = {
  [key in HttpMethods]: {
    background: string;
    text: string;
  };
};
export const BADGE_COLORS: BadgeColors = {
  GET: {
    background: "bg-emerald-500/25",
    text: "text-emerald-500",
  },
  POST: {
    background: "bg-blue-500/25",
    text: "text-blue-500",
  },
  PUT: {
    background: "bg-amber-500/25",
    text: "text-amber-500",
  },
  DELETE: {
    background: "bg-red-500/25",
    text: "text-red-500",
  },
};
