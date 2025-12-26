import { HttpMethods } from "@/types/fapi";

export interface CardHeaderProps {
  method: HttpMethods;
  path: string;
  onCopyEndpoint: () => void;
}
