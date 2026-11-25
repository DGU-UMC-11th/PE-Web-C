import type { Metadata } from "next";
import { MyInfoEditPage } from "../../../../views/members/my-info-edit-page";

export const metadata: Metadata = { title: "내 정보 수정" };

export default function MeEdit() {
  return <MyInfoEditPage />;
}
