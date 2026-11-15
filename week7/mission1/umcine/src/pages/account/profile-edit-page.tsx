import { useRef, useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AuthCard, AuthField, primaryButtonClass, secondaryButtonClass } from "../../components/auth/auth-ui";
import { ProfileState } from "../../components/auth/profile-state";
import { MY_INFO_QUERY_KEY, type MyInfo } from "../../api/members/get-my-info";
import { updateMyInfo } from "../../api/members/update-my-info";
import { useAuthStore } from "../../stores/auth-store";
import { useMyInfo } from "../../hooks/use-my-info";
import { isNicknameValid } from "../../utils/auth-validation";
import { getMemberErrorMessage } from "../../utils/get-member-error-message";

function ProfileEditForm({ profile }: { profile: MyInfo }) {
  const queryClient = useQueryClient();
  const setAuthNickname = useAuthStore((state) => state.setNickname);
  const [nickname, setNickname] = useState(profile.nickname);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const pending = useRef(false);
  const isValid = isNicknameValid(nickname);
  const isChanged = nickname.trim() !== profile.nickname;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid || !isChanged || pending.current) return;
    pending.current = true;
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    // 요청 중 로그아웃하거나 계정을 바꿨다면 이전 응답을 반영하지 않아요.
    const token = useAuthStore.getState().accessToken;
    try {
      const updated = await updateMyInfo(nickname.trim());
      if (useAuthStore.getState().accessToken !== token) return;
      await queryClient.cancelQueries({ queryKey: MY_INFO_QUERY_KEY });
      queryClient.setQueryData(MY_INFO_QUERY_KEY, updated);
      setAuthNickname(updated.nickname);
      setNickname(updated.nickname);
      setSuccess("내 정보를 수정했어요.");
    } catch (error) {
      setError(getMemberErrorMessage(error, "내 정보를 수정하지 못했어요. 다시 시도해 주세요."));
    } finally {
      pending.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title="내 정보 수정" description="나를 표현하는 닉네임으로 바꿔보세요.">
      <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting} className="space-y-5">
        <AuthField id="profile-email" label="이메일" type="email" value={profile.email} readOnly hint="이메일은 변경할 수 없어요." className="bg-[#f6f7f9] text-[#656a73]" />
        <AuthField id="profile-nickname" label="닉네임" autoComplete="nickname" value={nickname} disabled={isSubmitting}
          onChange={(e) => { setNickname(e.target.value); setError(""); setSuccess(""); }} hint="앞뒤 공백을 제외하고 2~12자로 입력해 주세요."
          error={!isValid ? "닉네임은 2~12자로 입력해 주세요." : undefined} />
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}
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
  if (!profile.isLoggedIn || profile.isPending || profile.isError || !profile.data) {
    return <ProfileState isLoggedIn={profile.isLoggedIn} isPending={profile.isPending}
      message={getMemberErrorMessage(profile.error, "내 정보를 불러오지 못했어요.")}
      onRetry={() => void profile.refetch()} />;
  }
  return <ProfileEditForm key={profile.data.email} profile={profile.data} />;
}
