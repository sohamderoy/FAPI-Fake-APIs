import { FAPI_LIMITS } from "@/utils/data";
import { EndpointStatsProps } from "./types";

const EndpointStats = ({ currentEndpointCount }: EndpointStatsProps) => {
  const isAtMaxLimit = currentEndpointCount >= FAPI_LIMITS.MAX_ENDPOINTS;

  return (
    <div className="flex-shrink-0">
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg">
        <span className="text-sm text-gray-400 font-googleSansFlex">
          No. of FAPIs Created:
        </span>
        <span className="text-lg font-semibold text-white font-googleSansFlex">
          {currentEndpointCount}
        </span>
        <span className="text-gray-500">/</span>
        <span className="text-lg font-semibold text-gray-400 font-googleSansFlex">
          {FAPI_LIMITS.MAX_ENDPOINTS}
        </span>
        {isAtMaxLimit && (
          <span className="ml-2 px-2 py-1 text-xs bg-red-600/20 text-red-400 rounded border border-red-600/30">
            Max FAPI Creation Limit Reached
          </span>
        )}
      </div>
    </div>
  );
};

export default EndpointStats;
