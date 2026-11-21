import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../../pages/account/profile-page";

export const Route = createFileRoute("/(account)/_authenticated/mypage/")({
  component: ProfilePage,
});
