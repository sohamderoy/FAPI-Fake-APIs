import { BADGE_COLORS } from "./data";
import { BadgeProps } from "./types";

const Badge = ({ method }: BadgeProps) => {
  const color = BADGE_COLORS[method];

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-md ${color.background} ${color.text}`}
    >
      {method}
    </span>
  );
};

export default Badge;
