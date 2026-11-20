import { Link } from "@tanstack/react-router";
import { useProfileStore } from "../../stores/profile-store";

/**
 * 내 정보 조회 화면이에요.
 * GET /members/me 연동은 8주차에서 붙이고, 지금은 화면만 만들어 둡니다.
 */
export function MyInfoPage() {
  const email = useProfileStore((state) => state.email);
  const nickname = useProfileStore((state) => state.nickname);

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 justify-center px-4 py-12 sm:px-6 lg:px-20">
      <section className="flex w-full max-w-[460px] flex-col gap-6 rounded-2xl border border-border bg-surface p-7">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] font-bold tracking-[-1px] text-ink">
            내 정보
          </h1>
          <p className="text-sm text-secondary">
            회원 정보를 확인하고 닉네임을 바꿀 수 있어요.
          </p>
        </div>

        <dl className="flex flex-col divide-y divide-border border-y border-border">
          <InfoRow label="이메일" value={email} />
          <InfoRow label="닉네임" value={nickname} />
        </dl>

        <Link
          to="/me/edit"
          className="flex h-[50px] items-center justify-center rounded-[10px] bg-ink text-sm font-extrabold text-white"
        >
          정보 수정
        </Link>
      </section>
    </main>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <dt className="text-sm font-bold text-secondary">{label}</dt>
      <dd className="min-w-0 truncate text-sm text-ink">{value}</dd>
    </div>
  );
}
