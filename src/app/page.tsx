import { redirect } from "next/navigation";
import { HOME_PAGE_PATH } from "@/utils/data";

export default function RootPage() {
  redirect(HOME_PAGE_PATH);
}
