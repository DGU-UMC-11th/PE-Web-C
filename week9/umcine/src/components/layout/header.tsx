"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthHydrated, useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const navLinkClass = "text-[15px] font-medium text-gray-500 no-underline";
const navLinkActiveClass = cn(navLinkClass, "text-gray-900 font-bold");
const outlineButtonClass =
  "rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 no-underline cursor-pointer";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[1200px] items-center gap-10 px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xl font-bold text-gray-900 no-underline"
        >
          <Image src="/icons/movie.svg" alt="" width={24} height={24} />
          <span>UMCine</span>
        </Link>

        {/* 현재 경로는 요청을 받아야 알 수 있어서, 경로를 읽는 메뉴만 Suspense로 감싸요.
            경로를 읽기 전에는 활성 표시 없는 메뉴를 먼저 보여 줘요. */}
        <Suspense fallback={<NavLinks pathname={null} />}>
          <ActiveNavLinks />
        </Suspense>

        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center border-none bg-transparent p-0 cursor-pointer"
            aria-label="검색"
          >
            <Image src="/icons/search.svg" alt="" width={20} height={20} />
          </button>
          <AuthArea />
        </div>
      </div>
    </header>
  );
}

// TanStack Router의 activeProps 대신 현재 경로를 읽어 활성 메뉴를 표시해요.
function ActiveNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}

function NavLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav className="flex items-center gap-6">
      <Link
        href="/"
        className={pathname === "/" ? navLinkActiveClass : navLinkClass}
      >
        영화
      </Link>
      <Link
        href="/search"
        className={
          pathname?.startsWith("/search") ? navLinkActiveClass : navLinkClass
        }
      >
        검색
      </Link>
    </nav>
  );
}

function AuthArea() {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();
  const router = useRouter();
  // 토큰의 유효성은 내 정보 API가 확인해요. 401이면 토큰이 비워져 로그인 링크로 바뀌어요.
  const meQuery = useMeQuery();

  function handleLogout() {
    setAccessToken(null);
    // 다른 계정으로 로그인했을 때 이전 회원의 데이터가 보이지 않도록 지워요.
    queryClient.removeQueries({ queryKey: ["members"] });
    queryClient.removeQueries({ queryKey: ["favorites"] });
    router.push("/");
  }

  // 저장된 토큰을 읽기 전에는 로그인 여부를 모르므로 자리만 잡아 둬요.
  if (!hydrated || (accessToken && meQuery.isLoading)) {
    return (
      <span
        aria-label="내 정보를 불러오는 중"
        className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"
      />
    );
  }

  if (!accessToken) {
    return (
      <>
        <Link href="/login" className={outlineButtonClass}>
          로그인
        </Link>
        <Link
          href="/signup"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline"
        >
          회원가입
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/me"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline"
      >
        {meQuery.data ? `${meQuery.data.nickname}님의 마이페이지` : "마이페이지"}
      </Link>
      <button type="button" onClick={handleLogout} className={outlineButtonClass}>
        로그아웃
      </button>
    </>
  );
}
