import { memo } from "react";
import { BADGE_COLORS } from "./data";
import { BadgeProps } from "./types";

const Badge = ({ method }: BadgeProps) => {
  const color = BADGE_COLORS[method];

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-1 text-base font-medium rounded-md font-googleSansCode ${color.background} ${color.text}`}
    >
      {method}
    </span>
  );
};

export default memo(Badge);
