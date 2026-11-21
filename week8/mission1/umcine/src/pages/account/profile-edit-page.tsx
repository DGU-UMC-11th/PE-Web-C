import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AuthCard, AuthField, primaryButtonClass, secondaryButtonClass } from "../../components/auth/auth-ui";
import { ProfileState } from "../../components/auth/profile-state";
import type { MyInfo } from "../../api/members/get-my-info";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { useMyInfo } from "../../hooks/use-my-info";
import { isNicknameValid } from "../../utils/auth-validation";
import { getMemberErrorMessage } from "../../utils/get-member-error-message";

function ProfileEditForm({ profile, refreshError, isRefreshing, onRetry }: {
  profile: MyInfo; refreshError?: string; isRefreshing: boolean; onRetry: () => void;
}) {
  const updateMutation = useUpdateMeMutation();
  const [nicknameDraft, setNicknameDraft] = useState<string | null>(null);
  const nickname = nicknameDraft ?? profile.nickname;
  const isSubmitting = updateMutation.isPending;
  const success = updateMutation.isSuccess;
  const error = updateMutation.isError
    ? getMemberErrorMessage(updateMutation.error, "내 정보를 수정하지 못했어요. 다시 시도해 주세요.")
    : "";
  const isValid = isNicknameValid(nickname);
  const isChanged = nickname.trim() !== profile.nickname;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const accessToken = useAuthStore.getState().accessToken;
    if (!isValid || !isChanged || isSubmitting || !accessToken) return;
    updateMutation.mutate({ nickname: nickname.trim(), accessToken }, {
      onSuccess: () => {
        if (useAuthStore.getState().accessToken === accessToken) {
          setNicknameDraft(null);
        }
      },
    });
  }

  return (
    <AuthCard title="내 정보 수정" description="나를 표현하는 닉네임으로 바꿔보세요.">
      <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting} className="space-y-5">
        {refreshError && <div role="status" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <p>{refreshError} 입력 중인 내용은 유지돼요.</p>
          <button type="button" onClick={onRetry} disabled={isRefreshing || isSubmitting}
            className="mt-2 font-bold underline disabled:opacity-50">{isRefreshing ? "확인 중" : "다시 조회"}</button>
        </div>}
        <AuthField id="profile-email" label="이메일" type="email" value={profile.email} readOnly hint="이메일은 변경할 수 없어요." className="bg-[#f6f7f9] text-[#656a73]" />
        <AuthField required id="profile-nickname" label="닉네임" autoComplete="nickname" value={nickname} disabled={isSubmitting}
          onChange={(e) => { setNicknameDraft(e.target.value); updateMutation.reset(); }} hint="앞뒤 공백을 제외하고 2~12자로 입력해 주세요."
          error={!isValid ? "닉네임은 2~12자로 입력해 주세요." : undefined} />
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">내 정보를 수정했어요.</p>}
        <div className="flex gap-3 pt-2">
          {isSubmitting ? <button type="button" disabled className={`${secondaryButtonClass} flex-1`}>취소</button>
            : <Link to="/mypage" className={`${secondaryButtonClass} flex-1`}>{success ? "내 정보로" : "취소"}</Link>}
          <button type="submit" disabled={!isValid || !isChanged || isSubmitting} className={`${primaryButtonClass} flex-1`}>{isSubmitting ? "저장 중" : "저장하기"}</button>
        </div>
      </form>
    </AuthCard>
  );
}

export function ProfileEditPage() {
  const profile = useMyInfo();
  if (!profile.isLoggedIn || !profile.data) {
    return <ProfileState isLoggedIn={profile.isLoggedIn} isPending={profile.isLoading}
      message={getMemberErrorMessage(profile.error, "내 정보를 불러오지 못했어요.")}
      onRetry={() => void profile.refetch()} />;
  }
  return <ProfileEditForm key={profile.data.email} profile={profile.data}
    refreshError={profile.isError ? getMemberErrorMessage(profile.error, "최신 정보를 불러오지 못했어요.") : undefined}
    isRefreshing={profile.isFetching} onRetry={() => void profile.refetch()} />;
}
