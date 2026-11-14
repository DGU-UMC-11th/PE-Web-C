import { Link } from "@tanstack/react-router";
import { useMyInfoStore } from "../../stores/my-info-store";

export function MyInfoPage() {
  const email = useMyInfoStore((state) => state.email);
  const nickname = useMyInfoStore((state) => state.nickname);
  const createdAt = useMyInfoStore((state) => state.createdAt);

  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold">내 정보</h1>

      <dl className="mt-8 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        <InfoRow label="이메일" value={email} />
        <InfoRow label="닉네임" value={nickname} />
        <InfoRow
          label="가입일"
          value={new Date(createdAt).toLocaleDateString("ko-KR")}
        />
      </dl>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          to="/me/edit"
          className="rounded-md bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white no-underline"
        >
          내 정보 수정
        </Link>
        <Link
          to="/me/ratings"
          className="rounded-md border border-gray-300 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 no-underline"
        >
          내 평점 보기
        </Link>
      </div>
    </main>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <dt className="text-sm font-semibold text-gray-500">{label}</dt>
      <dd className="min-w-0 truncate text-sm text-gray-900">{value}</dd>
    </div>
  );
}
