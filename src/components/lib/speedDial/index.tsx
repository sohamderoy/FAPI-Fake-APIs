import { Plus } from "lucide-react";
import { SpeedDialProps } from "./types";
import {
  SpeedDial as MuiSpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";

const SpeedDial = ({
  actions,
  onActionClick,
  position = { bottom: 32, right: 32 },
}: SpeedDialProps) => {
  return (
    <MuiSpeedDial
      ariaLabel="SpeedDial Actions"
      sx={{
        position: "absolute",
        ...position,
      }}
      icon={<SpeedDialIcon icon={<Plus className="w-8 h-8" />} />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={<action.icon className="w-5 h-5" />}
          tooltipTitle={action.name}
          onClick={() => onActionClick(action.action)}
        ></SpeedDialAction>
      ))}
    </MuiSpeedDial>
  );
};

export default SpeedDial;
