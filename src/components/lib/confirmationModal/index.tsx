import React from "react";
import { ConfirmationModalProps } from "./types";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  buttons,
  onClose,
}) => {
  if (!isOpen) return null;

  const getButtonStyles = (variant: string = "primary"): string => {
    const baseStyles = "flex-1 px-4 py-3 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 hover:opacity-90";

    const variantStyles = {
      primary: "bg-gradient-to-r from-blue-600 to-purple-600",
      danger: "bg-gradient-to-r from-red-600 to-red-700",
      secondary: "bg-gradient-to-r from-gray-600 to-gray-700",
      success: "bg-gradient-to-r from-green-600 to-green-700",
    };

    return `${baseStyles} ${variantStyles[variant as keyof typeof variantStyles] || variantStyles.primary}`;
  };

  const handleBackdropClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl"></div>

        <div className="relative p-6">
          {/* Title */}
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line font-jetbrains">
            {message}
          </p>

          {/* Dynamic Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={button.className || getButtonStyles(button.variant)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
