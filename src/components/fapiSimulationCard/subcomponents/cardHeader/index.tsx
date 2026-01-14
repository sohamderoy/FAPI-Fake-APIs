import { Tooltip } from "@mui/material";
import { Badge, CopyButton } from "@/lib";
import { getFapiUrl } from "@/utils/functions";
import { CardHeaderProps } from "./types";
import { BORDER_COLOR_MAP } from "./data";

const CardHeader = ({ method, path }: CardHeaderProps) => {
  const fullUrl = getFapiUrl(path);

  return (
    <div className="flex items-center justify-between gap-2 w-full min-w-0">
      <div
        className={`flex items-center gap-2 bg-black px-2 py-1 rounded-md border min-w-0 ${BORDER_COLOR_MAP[method]}`}
      >
        <Tooltip title={path} arrow placement="top">
          <span className="text-base font-semibold truncate text-white font-googleSansCode block min-w-0">
            {path}
          </span>
        </Tooltip>
        <CopyButton
          textToCopy={fullUrl}
          tooltipText="Copy FAPI URL"
          size={14}
        />
      </div>
      <Badge method={method} />
    </div>
  );
};

export default CardHeader;
