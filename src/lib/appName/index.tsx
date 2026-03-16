import Image from "next/image";
import Link from "next/link";
import { HOME_PAGE_PATH } from "@/utils/data";
import { fapiLogo } from "@assets/img";
import { AppNameProps } from "./types";

const AppName = ({ style, logoWidth = 110, logoHeight = 40 }: AppNameProps) => {
  return (
    <Link href={HOME_PAGE_PATH} className="cursor-pointer inline-block">
      <Image
        src={fapiLogo}
        alt="FAPI"
        width={logoWidth}
        height={logoHeight}
        style={style}
      />
    </Link>
  );
};

export default AppName;
