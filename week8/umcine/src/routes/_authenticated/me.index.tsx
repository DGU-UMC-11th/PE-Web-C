import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../pages/members/my-page";

// me.index.tsx 로 둬야 /me 와 /me/edit 이 형제 라우트가 돼요.
// me.tsx 로 두면 /me 가 /me/edit 의 부모가 되어, Outlet 없이는 자식이 그려지지 않아요.
export const Route = createFileRoute("/_authenticated/me/")({ component: MyPage });
