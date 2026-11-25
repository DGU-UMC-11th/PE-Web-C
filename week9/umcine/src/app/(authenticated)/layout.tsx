import type { ReactNode } from "react";
import { RequireAuth } from "../../components/auth/require-auth";

// TanStack Router의 _authenticated 폴더 → Next.js의 (authenticated) 라우트 그룹
// 괄호 폴더는 URL에 나타나지 않아서 주소는 /me, /me/edit 그대로예요.
export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
