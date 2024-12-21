import { Modal as MuiModal, IconButton, Backdrop } from "@mui/material";
import { X as CloseIcon } from "lucide-react";
import { ModalProps } from "./types";
import { MODAL_SIZES } from "./data";

const Modal = ({
  isModalOpen,
  onClose,
  children,
  size = "md",
  title,
  footer,
  showCloseButton = true,
}: ModalProps) => {
  return (
    <MuiModal
      open={isModalOpen}
      onClose={onClose}
      slot={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          className: "backdrop-blur-sm bg-black/30",
        },
      }}
    >
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-xl border border-gray-800 outline-none font-outfit overflow-y-auto shadow-2xl ${MODAL_SIZES[size]}`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-50">{title}</h2>
          {/* Close Button */}
          {showCloseButton && (
            <IconButton
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
              size="small"
            >
              <CloseIcon size={20} />
            </IconButton>
          )}
        </div>

        {/* Main Content */}

        <div className="space-y-4">{children}</div>

        {/* Footer Section */}
        {footer && (
          <div className="mt-6 flex justify-start space-x-4">{footer}</div>
        )}
      </div>
    </MuiModal>
  );
};

export default Modal;
