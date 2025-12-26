import { CARD_SIZES } from "./data";
import { CardProps } from "./types";

const Card = ({
  children,
  className = "",
  width = "md",
  height = "md",
  borderGradient = "hover",
}: CardProps) => {
  const getBorderClasses = () => {
    if (borderGradient === "hover") {
      return "bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-[#0EA5E9] group-hover:via-[#8B5CF6] group-hover:to-[#EC4899] transition-all duration-300 ease-in-out";
    }
    if (borderGradient === true) {
      return "bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#EC4899]";
    }
    return "bg-gray-800";
  };

  return (
    <div className="group relative inline-block transition-all duration-300 hover:scale-[1.02]">
      {/* Animated gradient glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

      <div className={`relative rounded-lg p-[1px] ${getBorderClasses()} transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]`}>
        <div
          className={`relative rounded-lg bg-black p-4 ${CARD_SIZES.width[width]} ${CARD_SIZES.height[height]} ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
