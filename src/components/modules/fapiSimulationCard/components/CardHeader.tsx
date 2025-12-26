import { Tooltip } from "@mui/material";
import { Copy as CopyIcon } from "lucide-react";
import { Badge } from "@/components/lib";
import { HttpMethods } from "@/types/fapi";

interface CardHeaderProps {
  method: HttpMethods;
  path: string;
  onCopyEndpoint: () => void;
}

const CardHeader = ({ method, path, onCopyEndpoint }: CardHeaderProps) => {
  // Map method to border color
  const borderColorMap = {
    GET: "border-emerald-500/75",
    POST: "border-blue-500/75",
    PUT: "border-amber-500/75",
    DELETE: "border-red-500/75",
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full min-w-0">
      <div
        className={`flex items-center gap-2 bg-black px-2 py-1 rounded-md border min-w-0 ${borderColorMap[method]}`}
      >
        <Tooltip title={path} arrow placement="top">
          <span className="text-base font-semibold truncate text-white font-googleSansCode block min-w-0">
            {path}
          </span>
        </Tooltip>
        <Tooltip title="Copy endpoint" arrow placement="top">
          <button
            onClick={onCopyEndpoint}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
          >
            <CopyIcon size={14} className="text-gray-400" />
          </button>
        </Tooltip>
      </div>
      <Badge method={method} />
    </div>
  );
};

export default CardHeader;
