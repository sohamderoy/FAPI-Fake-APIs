import React from "react";
import { X as CloseIcon } from "lucide-react";

export const getSnackbarMessage = (
  message: string,
  onClose: () => void
): React.ReactElement => {
  return (
    <div className="flex items-center justify-between w-full">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
};
