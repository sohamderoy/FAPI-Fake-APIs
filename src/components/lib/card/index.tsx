import { CARD_SIZES } from "./data";
import { CardProps } from "./types";

const Card = ({
  children,
  className = "",
  width = "md",
  height = "md",
  borderGradient = "hover",
  hoverEffect = true,
}: CardProps) => {
  const getBorderClasses = () => {
    if (borderGradient === "hover") {
      return "bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-[#0EA5E9] group-hover:via-[#8B5CF6] group-hover:to-[#EC4899] transition-all duration-1000 ease-in-out";
    }
    if (borderGradient === true) {
      return "bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#EC4899]";
    }
    return "bg-gray-800";
  };

  return (
    <div className="group relative inline-block">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className={`rounded-lg p-[1px] ${getBorderClasses()}`}>
        <div
          className={`relative rounded-lg bg-black font-outfit p-4 ${CARD_SIZES.width[width]} ${CARD_SIZES.height[height]} ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
