import Link from "next/link";
import { HOME_PAGE_PATH } from "@/utils/data";
import { AppNameProps } from "./types";

const AppName = ({ style }: AppNameProps) => {
  return (
    <Link href={HOME_PAGE_PATH} className="cursor-pointer">
      <h1
        className="font-extrabold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent font-googleSansFlex hover:from-blue-400 hover:to-indigo-400 transition-all"
        style={style}
      >
        FAPI
      </h1>
    </Link>
  );
};

export default AppName;
