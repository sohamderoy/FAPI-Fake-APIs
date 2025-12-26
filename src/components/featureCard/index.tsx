import { FeatureCardProps } from "./types";

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  iconColor,
}: FeatureCardProps) => {
  return (
    <div className="group relative rounded-xl p-[1px] bg-gray-800 hover:bg-gradient-to-r hover:from-[#0EA5E9] hover:via-[#8B5CF6] hover:to-[#EC4899] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-[1.02]">
      {/* Animated gradient glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

      {/* Main card container */}
      <div className="relative h-full p-6 bg-black rounded-xl font-googleSansFlex">
        {/* Icon */}
        {Icon && (
          <Icon
            className={`w-8 h-8 mb-4 ${iconColor} group-hover:scale-110 transition-transform duration-300`}
            strokeWidth={2}
          />
        )}

        {/* Card content */}
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold mb-3 text-gray-50 group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-400 font-normal text-sm text-left leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Subtle dot pattern background */}
        <div
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>
    </div>
  );
};

export default FeatureCard;
