import { AppNameProps } from "./types";

const AppName = ({ style }: AppNameProps) => {
  return (
    <h1
      className="font-extrabold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent font-googleSansFlex"
      style={style}
    >
      FAPI
    </h1>
  );
};

export default AppName;
