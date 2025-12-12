export interface ButtonProps {
  name: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}
