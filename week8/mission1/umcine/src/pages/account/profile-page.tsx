import { Link } from "@tanstack/react-router";
import { AuthCard, primaryButtonClass } from "../../components/auth/auth-ui";
import { FavoritesList } from "../../components/movies/favorites-list";
import { ProfileState } from "../../components/auth/profile-state";
import { useMyInfo } from "../../hooks/use-my-info";
import { getMemberErrorMessage } from "../../utils/get-member-error-message";

export function ProfilePage() {
  const profile = useMyInfo();
  if (!profile.isLoggedIn || !profile.data) {
    return <ProfileState isLoggedIn={profile.isLoggedIn} isPending={profile.isLoading}
      message={getMemberErrorMessage(profile.error, "내 정보를 불러오지 못했어요.")}
      onRetry={() => void profile.refetch()} />;
  }
  const { email, nickname, createdAt } = profile.data;

  return (
    <AuthCard title="내 정보" description="나의 프로필 정보를 확인하고 수정해 보세요.">
      <div className="mb-7 flex flex-col items-center border-b border-[#e8e9ed] pb-7">
        <div aria-hidden="true" className="mb-4 flex size-20 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-blue-600">{Array.from(nickname)[0]}</div>
        <p className="text-lg font-extrabold">{nickname}</p>
        <p className="mt-1 text-sm text-[#656a73]">영화를 사랑하는 UMCine 멤버</p>
      </div>
      <dl className="mb-8 space-y-5 text-sm">
        <div><dt className="mb-2 font-bold text-[#656a73]">이메일</dt><dd className="break-all">{email}</dd></div>
        <div><dt className="mb-2 font-bold text-[#656a73]">닉네임</dt><dd className="break-all">{nickname}</dd></div>
        {createdAt && <div><dt className="mb-2 font-bold text-[#656a73]">가입일</dt><dd>{createdAt.slice(0, 10)}</dd></div>}
      </dl>
      <Link to="/mypage/edit" className={primaryButtonClass}>내 정보 수정</Link>
      <FavoritesList />
    </AuthCard>
  );
}
