import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  width?: "sm" | "md" | "lg" | "xl" | "full";
  height?: "sm" | "md" | "lg" | "xl" | "full";
  borderGradient?: boolean | "hover";
}
