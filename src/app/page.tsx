import { redirect } from "next/navigation";
import { HOME_PAGE_PATH } from "@/utils/data/paths/paths.ui.constants";

export default function RootPage() {
  redirect(HOME_PAGE_PATH);
}
