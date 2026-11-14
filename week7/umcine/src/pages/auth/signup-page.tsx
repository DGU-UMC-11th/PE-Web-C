import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { TextField } from "../../components/form/text-field";

// 이메일 형식 검사 (g 플래그를 붙이면 test()가 호출할 때마다 결과가 달라져요)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

export function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류를 표시해요
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출할 수 있어요
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: string) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 해요
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: response.available },
      }));
      alert(
        response.available
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      navigate({ to: "/login" });
    } catch {
      // 실패해도 입력값은 그대로 둬서 바로 다시 시도할 수 있게 해요
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 justify-center px-4 py-12 sm:px-6 lg:px-20">
      {/* noValidate로 브라우저 기본 유효성 검사를 끄고 우리가 직접 안내해요 */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-[460px] flex-col gap-5 rounded-2xl border border-border bg-surface p-7"
      >
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] font-bold tracking-[-1px] text-ink">
            회원가입
          </h1>
          <p className="text-sm text-secondary">
            UMCine에서 영화에 평점을 남겨보세요.
          </p>
        </div>

        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="movie@umc.com"
          value={form.email}
          disabled={duplicateCheck.email.isChecking}
          onChange={(event) => handleChangeField("email", event.target.value)}
          errorMessage={
            showEmailError ? "이메일 형식이 올바르지 않아요." : null
          }
          helperMessage={
            duplicateCheck.email.isAvailable ? "사용할 수 있는 이메일이에요." : null
          }
          trailing={
            <DuplicateCheckButton
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              isChecking={duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
            />
          }
        />

        <TextField
          label="닉네임"
          type="text"
          autoComplete="nickname"
          placeholder="2~12자"
          value={form.nickname}
          disabled={duplicateCheck.nickname.isChecking}
          onChange={(event) => handleChangeField("nickname", event.target.value)}
          errorMessage={
            showNicknameError ? "닉네임은 2자 이상 12자 이하로 입력해 주세요." : null
          }
          helperMessage={
            duplicateCheck.nickname.isAvailable
              ? "사용할 수 있는 닉네임이에요."
              : null
          }
          trailing={
            <DuplicateCheckButton
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              isChecking={duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
            />
          }
        />

        <TextField
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="대문자·소문자·숫자·특수문자 포함 8자 이상"
          value={form.password}
          onChange={(event) => handleChangeField("password", event.target.value)}
          errorMessage={
            showPasswordError
              ? "대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상이어야 해요."
              : null
          }
        />

        <TextField
          label="비밀번호 확인"
          type="password"
          autoComplete="new-password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          value={form.passwordConfirm}
          onChange={(event) =>
            handleChangeField("passwordConfirm", event.target.value)
          }
          errorMessage={
            showPasswordConfirmError ? "비밀번호가 일치하지 않아요." : null
          }
        />

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="mt-1 flex h-[50px] items-center justify-center rounded-[10px] bg-accent text-sm font-extrabold text-white disabled:bg-accent-disabled"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="text-center text-xs text-secondary">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="font-bold text-accent">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}

interface DuplicateCheckButtonProps {
  disabled: boolean;
  isChecking: boolean;
  onClick: () => void;
}

function DuplicateCheckButton({
  disabled,
  isChecking,
  onClick,
}: DuplicateCheckButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-[50px] shrink-0 rounded-[10px] border border-border bg-surface px-3.5 text-xs font-bold text-ink disabled:text-muted"
    >
      {isChecking ? "확인 중" : "중복 확인"}
    </button>
  );
}
