import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkNickname } from "../../api/members/check-nickname";
import {
  FormField,
  INPUT_CLASS,
  INPUT_ERROR_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from "../../components/form/form-field";
import { StatusMessage } from "../../components/movies/status-message";
import { useProfileStore } from "../../stores/profile-store";
import { cn } from "../../utils/cn";
import { isValidNickname } from "../../utils/validators";

// 7주차 필수 미션: 내 정보 수정 화면. 닉네임만 바꿀 수 있고 이메일은 읽기 전용이에요.
// 저장은 8주차에 PATCH /members/me 요청으로 바꿔요. 지금은 store에 반영해서 조회 화면에서 바뀐 값을 확인해요.
export function MyInfoEditPage() {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const updateNickname = useProfileStore((state) => state.updateNickname);
  const clearProfile = useProfileStore((state) => state.clearProfile);

  const [nickname, setNickname] = useState(profile?.nickname ?? "");
  const [check, setCheck] = useState({ isChecking: false, isAvailable: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!profile) {
    return (
      <main className="flex w-full flex-1 flex-col items-start gap-3 px-4 py-6 sm:px-10 lg:px-20">
        <StatusMessage>로그인하면 내 정보를 수정할 수 있어요.</StatusMessage>
        <Link to="/login" className="text-sm font-bold text-action-primary hover:underline">
          로그인하러 가기
        </Link>
      </main>
    );
  }

  const trimmed = nickname.trim();
  const isChanged = trimmed !== profile.nickname;
  const isNicknameValid = isValidNickname(nickname);
  const showNicknameError = nickname.length > 0 && !isNicknameValid;
  // 내 닉네임을 그대로 두면 중복 확인이 필요 없고, 바꿨다면 중복 확인까지 통과해야 저장할 수 있어요.
  const canSubmit = isNicknameValid && (!isChanged || check.isAvailable) && isChanged;

  const handleChangeNickname = (value: string) => {
    if (check.isChecking) return;
    setCheck({ isChecking: false, isAvailable: false });
    setNickname(value);
  };

  const handleCheckDuplicate = async () => {
    if (!isNicknameValid || check.isChecking) return;
    setCheck({ isChecking: true, isAvailable: false });
    try {
      const response = await checkNickname(trimmed);
      setCheck({ isChecking: false, isAvailable: response.available });
      alert(response.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setCheck({ isChecking: false, isAvailable: false });
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    // 8주차: PATCH /members/me { nickname } 로 교체
    updateNickname(trimmed);
    setIsSubmitting(false);
    alert("변경사항을 저장했어요.");
    navigate({ to: "/me" });
  };

  const handleWithdraw = () => {
    // 회원 탈퇴 API는 아직 없어요. 화면 동작만 확인할 수 있도록 저장된 정보만 지워요.
    if (!confirm("정말 탈퇴하시겠어요? 저장된 정보가 삭제돼요.")) return;
    clearProfile();
    navigate({ to: "/" });
  };

  return (
    <main className="flex w-full flex-1 flex-col gap-8 px-4 py-6 sm:px-10 lg:px-20">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">내 정보 수정</h1>
            <p className="text-sm text-text-secondary">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button type="submit" className={PRIMARY_BUTTON_CLASS} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          {/* 프로필 이미지: 디자인에는 있지만 업로드 API가 없어서 자리만 잡아 둬요. */}
          <div className="flex flex-col items-center gap-2 lg:w-[320px]">
            <div className="relative">
              <span className="flex size-20 items-center justify-center rounded-full bg-bg-page">
                <img src="/icons/person.svg" alt="" width={32} height={32} />
              </span>
              <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border border-border-default bg-bg-surface">
                <img src="/icons/edit.svg" alt="" width={16} height={16} />
              </span>
            </div>
            <p className="text-sm font-bold text-text-primary">프로필 이미지</p>
            <p className="text-xs text-text-tertiary">선택 사항 · 최대 5MB</p>
          </div>

          <div className="flex flex-1 flex-col gap-5">
            <FormField
              id="edit-nickname"
              label="닉네임"
              error={showNicknameError ? "닉네임은 2~12자로 입력해 주세요." : null}
              hint={!isChanged ? "지금 쓰고 있는 닉네임이에요. 바꾸면 중복 확인이 필요해요." : undefined}
              action={
                <button
                  type="button"
                  className={SECONDARY_BUTTON_CLASS}
                  disabled={!isChanged || !isNicknameValid || check.isChecking}
                  onClick={handleCheckDuplicate}
                >
                  {check.isChecking ? "확인 중" : check.isAvailable ? "확인 완료" : "중복 확인"}
                </button>
              }
            >
              <input
                id="edit-nickname"
                type="text"
                className={cn(INPUT_CLASS, showNicknameError && INPUT_ERROR_CLASS)}
                value={nickname}
                disabled={check.isChecking}
                onChange={(event) => handleChangeNickname(event.target.value)}
              />
            </FormField>

            <FormField id="edit-email" label="이메일" hint="이메일은 변경할 수 없어요.">
              <input id="edit-email" type="email" className={INPUT_CLASS} value={profile.email} disabled readOnly />
            </FormField>
          </div>
        </div>
      </form>

      <section
        className="mt-auto flex flex-col gap-3 rounded-[10px] border border-danger-default/40 bg-danger-default/5 p-5 sm:flex-row sm:items-center sm:justify-between"
        aria-labelledby="withdraw"
      >
        <div className="flex flex-col gap-1">
          <h2 id="withdraw" className="text-sm font-bold text-danger-default">
            회원 탈퇴
          </h2>
          <p className="text-xs text-danger-default/80">탈퇴하면 작성한 평점, 즐겨찾기 정보가 모두 삭제되며 복구할 수 없습니다.</p>
        </div>
        <button
          type="button"
          onClick={handleWithdraw}
          className="h-[42px] rounded-lg border border-danger-default bg-bg-surface px-4 text-sm font-bold whitespace-nowrap text-danger-default hover:bg-danger-default/10"
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
