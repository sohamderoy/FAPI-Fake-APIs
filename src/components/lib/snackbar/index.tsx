import { SnackbarProps } from "./types";
import { Snackbar as MuiSnackbar } from "@mui/material";
import { getSnackbarMessage } from "./utils";
import { SNACKBAR_STYLES, SNACKBAR_ANCHOR_ORIGIN } from "./data";

const Snackbar = ({
  isOpen,
  onClose,
  message,
  autoHideDuration = 6000,
  backgroundColor = "#fff",
}: SnackbarProps) => {
  return (
    <MuiSnackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      message={getSnackbarMessage(message, onClose)}
      anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
      sx={{
        "& .MuiSnackbarContent-root": {
          minWidth: SNACKBAR_STYLES.minWidth,
          maxWidth: SNACKBAR_STYLES.maxWidth,
        },
      }}
      ContentProps={{
        sx: {
          backgroundColor,
          borderRadius: SNACKBAR_STYLES.borderRadius,
          padding: SNACKBAR_STYLES.padding,
          fontSize: SNACKBAR_STYLES.fontSize,
          fontFamily: SNACKBAR_STYLES.fontFamily,
        },
      }}
    />
  );
};

export default Snackbar;
