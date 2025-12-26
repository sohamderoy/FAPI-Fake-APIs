import { LucideIcon } from "lucide-react";

export interface SpeedDialAction {
  icon: LucideIcon;
  name: string;
  action: string;
  disabled?: boolean;
}
export interface SpeedDialProps {
  actions: SpeedDialAction[];
  onActionClick: (action: string) => void;
  position?: {
    bottom?: number;
    right?: number;
    top?: number;
    left?: number;
  };
}
