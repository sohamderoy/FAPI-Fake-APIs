import { SnackbarProps } from "./types";
import { Snackbar as MuiSnackbar } from "@mui/material";
import { X as CloseIcon } from "lucide-react";

const Snackbar = ({
  isOpen,
  onClose,
  message,
  autoHideDuration = 6000,
  backgroundColor = "#fff",
}: SnackbarProps) => {
  const getSnackbarMessage = (message: string) => {
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
  return (
    <MuiSnackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      message={getSnackbarMessage(message)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        "& .MuiSnackbarContent-root": {
          minWidth: "auto",
          maxWidth: "400px",
        },
      }}
      ContentProps={{
        sx: {
          backgroundColor,
          borderRadius: "8px",
          padding: "12px 24px",
          fontSize: "18px",
          fontFamily: "var(--font-google-sans-flex)",
        },
      }}
    />
  );
};

export default Snackbar;
