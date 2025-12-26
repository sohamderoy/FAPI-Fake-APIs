import { CardProps } from "./types";

export const getBorderClasses = (
  borderGradient: CardProps["borderGradient"]
): string => {
  if (borderGradient === "hover") {
    return "bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-[#0EA5E9] group-hover:via-[#8B5CF6] group-hover:to-[#EC4899] transition-all duration-300 ease-in-out";
  }
  if (borderGradient === true) {
    return "bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#EC4899]";
  }
  return "bg-gray-800";
};
