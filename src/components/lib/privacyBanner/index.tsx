import React from "react";
import { Shield } from "lucide-react";

const PrivacyBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-950/40 to-green-950/40 border border-emerald-500/30 rounded-lg p-3 flex items-center gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <Shield className="text-emerald-400" size={16} />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-base font-semibold text-emerald-300 mb-1">
          100% Local & Private
        </p>
        <p className="text-sm text-gray-200 leading-relaxed">
          FAPI data never leaves your machine unless you explicitly choose to
          export and share it.
        </p>
      </div>
    </div>
  );
};

export default PrivacyBanner;
