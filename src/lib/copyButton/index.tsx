"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Tooltip } from "@mui/material";
import { CopyButtonProps } from "./types";

const CopyButton = ({
  textToCopy,
  size = 16,
  tooltipText = "Copy",
  copiedTooltipText = "Copied!",
  className = "",
  iconClassName = "",
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Tooltip title={copied ? copiedTooltipText : tooltipText} arrow placement="top">
      <button
        onClick={handleCopy}
        className={`shrink-0 hover:opacity-70 transition-opacity cursor-pointer ${className}`}
      >
        {copied ? (
          <Check size={size} className={`text-emerald-400 ${iconClassName}`} />
        ) : (
          <Copy size={size} className={`text-gray-400 ${iconClassName}`} />
        )}
      </button>
    </Tooltip>
  );
};

export default CopyButton;
