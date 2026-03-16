import { CARD_SIZES } from "./data";
import { CardProps } from "./types";
import { getBorderClasses } from "./utils";

const Card = ({
  children,
  className = "",
  width = "md",
  height = "md",
  borderGradient = "hover",
}: CardProps) => {
  return (
    <div className="group relative inline-block transition-all duration-300 hover:scale-[1.02]">
      {/* Animated gradient glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

      <div
        className={`relative rounded-lg p-[1px] ${getBorderClasses(borderGradient)} transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]`}
      >
        <div
          className={`relative rounded-lg bg-[#020202] p-4 border border-gray-800 ${CARD_SIZES.width[width]} ${CARD_SIZES.height[height]} ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
