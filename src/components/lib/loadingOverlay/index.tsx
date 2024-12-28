import { CircularProgress } from "@mui/material";
import { LoadingOverlayProps } from "./types";

const LoadingOverlay = ({ overlayMessage }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl z-50">
      <div className="flex flex-col items-center space-y-4">
        <CircularProgress size={48} />
        <p className="text-white font-outfit">{overlayMessage}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
