import { ButtonProps } from "./types";
import { getButtonClasses } from "./utils";

const Button = ({
  name,
  onClick,
  disabled,
  variant = "primary",
}: ButtonProps) => {

  const isPrimary = variant === "primary";

  return (
    <div className="relative group w-full sm:w-auto">
      {/* Glow effects - only for primary variant and when not disabled */}
      {!disabled && isPrimary && (
        <>
          <div className="absolute -inset-6 bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#EC4899] rounded-3xl opacity-0 group-hover:opacity-5 blur-2xl transition-all duration-500 group-hover:duration-200 ease-out -z-10"></div>

          {/* Middle glow - medium spread */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#EC4899] rounded-2xl opacity-0 group-hover:opacity-15 blur-xl transition-all duration-500 group-hover:duration-200 ease-out -z-10"></div>

          {/* Inner glow - close to button */}
          <div className="absolute -inset-[3px] bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#EC4899] rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-all duration-500 group-hover:duration-200 ease-out -z-10"></div>

          {/* Sharp border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#EC4899] rounded-lg opacity-0 group-hover:opacity-80 transition-all duration-500 group-hover:duration-200 ease-out"></div>
        </>
      )}

      <button
        onClick={onClick}
        disabled={disabled}
        className={`relative w-full sm:w-auto font-googleSansFlex font-normal px-6 py-3 text-base rounded-lg transition-all duration-500 ease-out text-center flex justify-center items-center ${getButtonClasses(variant, disabled)}`}
      >
        {name}
      </button>
    </div>
  );
};

export default Button;
