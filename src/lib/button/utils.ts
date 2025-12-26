import { ButtonProps } from "./types";
import { BUTTON_STYLES } from "./data";

export const getButtonClasses = (
  variant: ButtonProps["variant"],
  disabled?: boolean
): string => {
  if (disabled) {
    return BUTTON_STYLES.disabled;
  }

  switch (variant) {
    case "primary":
      return BUTTON_STYLES.primary;
    case "secondary":
      return BUTTON_STYLES.secondary;
    case "danger":
      return BUTTON_STYLES.danger;
    default:
      return "";
  }
};
