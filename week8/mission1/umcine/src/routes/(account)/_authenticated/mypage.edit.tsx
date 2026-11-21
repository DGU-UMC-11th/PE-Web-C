import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "../../../pages/account/profile-edit-page";

export const Route = createFileRoute("/(account)/_authenticated/mypage/edit")({
  component: ProfileEditPage,
});
