import { ConfirmationModal, PrivacyBanner } from "@/lib";
import type { ConfirmationButton } from "@/lib";
import { ImportConfirmationModalProps } from "./types";

const ImportConfirmationModal = ({
  isOpen,
  fileName,
  isAtLimit,
  onMerge,
  onReplace,
  onCancel,
}: ImportConfirmationModalProps) => {
  const buttons: ConfirmationButton[] = [
    {
      label: "Cancel",
      onClick: onCancel,
      variant: "secondary",
    },
    {
      label: "Merge",
      onClick: onMerge,
      variant: "primary",
      disabled: isAtLimit,
    },
    {
      label: "Replace All",
      onClick: onReplace,
      variant: "danger",
    },
  ];

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Choose Import Strategy"
      message={
        <div className="space-y-5">
          {/* Privacy Banner */}
          <PrivacyBanner />

          <p>You are about to import endpoints from:</p>
          <div className="bg-black/80 px-4 py-3 rounded-md border border-gray-600">
            <span className="font-googleSansCode text-white break-all">
              {fileName || "unknown file"}
            </span>
          </div>
          <p className="font-semibold text-base">
            How would you like to proceed?
          </p>

          {/* Merge Strategy Card */}
          <div className="bg-gradient-to-r from-green-950/50 to-emerald-950/30 border-l-4 border-green-500 p-4 rounded-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-green-400 text-lg">+</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-300 mb-1">Merge</h4>
                <p className="text-sm text-gray-300">
                  Keep existing endpoints and add new ones from the file
                  (duplicates will be skipped)
                </p>
                {isAtLimit && (
                  <p className="text-xs text-red-400 mt-2">
                    ⚠️ Disabled: Maximum endpoint limit reached
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Replace All Strategy Card */}
          <div className="bg-gradient-to-r from-red-950/50 to-rose-950/30 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-red-400 text-lg leading-none flex items-center justify-center">
                  !
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-300 mb-1">
                  Replace All
                </h4>
                <p className="text-sm text-gray-300">
                  Delete all existing endpoints and import fresh from the file
                </p>
                <p className="text-xs text-red-400 mt-2">
                  ⚠️ The action of deleting existing endpoints cannot be undone
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      buttons={buttons}
      onClose={onCancel}
      size="lg"
    />
  );
};

export default ImportConfirmationModal;
