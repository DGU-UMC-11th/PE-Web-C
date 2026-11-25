import type { Metadata } from "next";
import { MyPage } from "../../../views/members/my-page";

export const metadata: Metadata = { title: "마이페이지" };

export default function Me() {
  return <MyPage />;
}
