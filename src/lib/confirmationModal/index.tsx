import React from "react";
import Modal from "@/lib/modal";
import Button from "@/lib/button";
import { ConfirmationModalProps } from "./types";
import { getButtonVariant } from "./utils";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  buttons,
  onClose,
  size = "md",
}) => {

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
          {buttons.map((button, index) => (
            <div key={index}>
              <Button
                name={button.label}
                onClick={button.onClick}
                variant={getButtonVariant(button.variant)}
                disabled={button.disabled}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
