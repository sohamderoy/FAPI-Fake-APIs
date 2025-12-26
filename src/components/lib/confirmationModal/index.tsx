import React from "react";
import Modal from "@/components/lib/modal";
import Button from "@/components/lib/button";
import { ConfirmationModalProps } from "./types";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  buttons,
  onClose,
  size = "md",
}) => {
  // Map confirmation button variants to our Button component variants
  const getButtonVariant = (variant?: string): "primary" | "secondary" => {
    if (variant === "secondary") return "secondary";
    return "primary";
  };

  // For danger variant, we'll use custom styling
  const getDangerButtonClass = () => {
    return "relative w-full sm:w-auto font-googleSansFlex font-normal px-6 py-3 text-base rounded-lg transition-all duration-500 ease-out text-center flex justify-center items-center bg-red-600 text-white hover:bg-red-700 border-2 border-red-600 hover:border-red-700";
  };

  return (
    <Modal
      isModalOpen={isOpen}
      onClose={onClose || (() => {})}
      title={title}
      size={size}
      showCloseButton={true}
      contentStyle={{ height: "h-auto" }}
    >
      <div className="px-6 pb-6">
        {/* Message */}
        <div className="text-gray-300 mb-8 leading-relaxed whitespace-pre-line break-words overflow-wrap-anywhere">
          {message}
        </div>

        {/* Dynamic Action Buttons */}
        <div className="flex gap-3 justify-end">
          {buttons.map((button, index) => {
            // Use custom styling for danger buttons
            if (button.variant === "danger") {
              return (
                <button
                  key={index}
                  onClick={button.onClick}
                  disabled={button.disabled}
                  className={`${getDangerButtonClass()} ${
                    button.disabled ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {button.label}
                </button>
              );
            }

            // Use the standard Button component for other variants
            return (
              <div key={index}>
                <Button
                  name={button.label}
                  onClick={button.onClick}
                  variant={getButtonVariant(button.variant)}
                  disabled={button.disabled}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
