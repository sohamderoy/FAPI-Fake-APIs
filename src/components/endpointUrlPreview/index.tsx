"use client";

import { CheckCircle } from "lucide-react";
import { CopyButton } from "@/lib";
import { getFapiUrl } from "@/utils/functions";
import { EndpointUrlPreviewProps } from "./types";

const EndpointUrlPreview = ({ path }: EndpointUrlPreviewProps) => {
  const port = typeof window !== "undefined" ? window.location.port : "3000";
  const baseUrl = `http://localhost:${port}/api/fapi`;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = getFapiUrl(path);

  return (
    <div className="mb-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-md flex items-start gap-2">
      <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={16} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-200 mb-1">
          Your Fake API (FAPI) Endpoint URL:
        </p>
        <code className="text-sm text-emerald-400/70 break-all font-googleSansCode">
          {baseUrl}
          <span className="font-bold text-emerald-300">{cleanPath}</span>
        </code>
      </div>
      <CopyButton
        textToCopy={fullUrl}
        tooltipText="Copy full FAPI URL"
        className="mt-0.5"
      />
    </div>
  );
};

export default EndpointUrlPreview;
