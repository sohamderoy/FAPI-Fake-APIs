import { FeatureCardProps } from "./types";

const FeatureCard = ({ title, description }: FeatureCardProps) => {
  return (
    <div className="group relative rounded-xl p-[1px] bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#EC4899]">
      {/* Main card container */}
      <div className="relative h-full p-5 bg-black rounded-xl font-outfit">
        {/* Card content */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-semibold mb-2 text-gray-50">{title}</h3>
          <p className="text-gray-400 font-normal text-sm text-left">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
