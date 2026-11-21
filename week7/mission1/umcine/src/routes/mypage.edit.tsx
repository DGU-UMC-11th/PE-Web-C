import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "../pages/account/profile-edit-page";

export const Route = createFileRoute("/mypage/edit")({ component: ProfileEditPage });
