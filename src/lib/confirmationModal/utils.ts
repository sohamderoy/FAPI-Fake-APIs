export const getButtonVariant = (
  variant?: string
): "primary" | "secondary" | "danger" => {
  if (variant === "secondary") return "secondary";
  if (variant === "danger") return "danger";
  return "primary";
};
