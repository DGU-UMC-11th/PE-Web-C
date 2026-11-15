import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface MyInfo {
  email: string;
  nickname: string;
}

const defaultInfo: MyInfo = {
  email: "weektest@example.com",
  nickname: "week7tester",
};

export function MyPage() {
  const [myInfo, setMyInfo] = useState<MyInfo>(defaultInfo);

  useEffect(() => {
    const savedInfo = localStorage.getItem("umcine-my-info");

    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo) as MyInfo;

        if (
          typeof parsedInfo.email === "string" &&
          typeof parsedInfo.nickname === "string"
        ) {
          setMyInfo(parsedInfo);
        }
      } catch {
        localStorage.removeItem("umcine-my-info");
      }
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[#f8fafc] px-5 py-16">
      <div className="mx-auto w-full max-w-[440px] rounded-2xl border border-[#e3e6eb] bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-[28px] font-extrabold text-[#17191e]">
          내 정보
        </h1>

        <p className="mb-8 text-center text-sm text-[#606774]">
          UMCine에서 사용하는 내 정보를 확인해 보세요.
        </p>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-bold text-[#17191e]">이메일</p>

            <div className="rounded-lg border border-[#d5dae2] bg-[#f8fafc] px-4 py-3 text-sm">
              {myInfo.email}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-[#17191e]">닉네임</p>

            <div className="rounded-lg border border-[#d5dae2] bg-[#f8fafc] px-4 py-3 text-sm">
              {myInfo.nickname}
            </div>
          </div>

          <Link
            to="/my/edit"
            className="block w-full rounded-lg bg-[#2563eb] py-3 text-center font-bold text-white"
          >
            내 정보 수정
          </Link>
        </div>
      </div>
    </main>
  );
}
