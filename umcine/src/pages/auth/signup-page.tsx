import { Link, useNavigate } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { signup, type ApiEnvelope } from "../../api/members/signup";
import {
  AuthCard,
  FormField,
  INPUT_CLASS,
  INPUT_ERROR_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from "../../components/form/form-field";
import { useProfileStore } from "../../stores/profile-store";
import { cn } from "../../utils/cn";
import { isValidEmail, isValidNickname, isValidPassword } from "../../utils/validators";

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const navigate = useNavigate();
  const setProfile = useProfileStore((state) => state.setProfile);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값의 유효성 검사
  const isEmailValid = isValidEmail(form.email);
  const isNicknameValid = isValidNickname(form.nickname);
  const isPasswordValid = isValidPassword(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError = form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({ ...prev, [key]: { isChecking: true, isAvailable: false } }));

    try {
      // 5주차 백엔드의 중복 확인 API. available이 true면 사용 가능해요.
      const response =
        key === "email"
          ? await checkEmail(form.email.trim())
          : await checkNickname(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isAvailable } }));
      alert(isAvailable ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isAvailable: false } }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isChecking: false } }));
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
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
      // 내 정보 화면이 방금 가입한 값을 보여 줄 수 있도록 저장해 둬요. (8주차에 로그인 응답으로 대체)
      setProfile({ email: response.result.email, nickname: response.result.nickname });
      navigate({ to: "/login" });
    } catch (error) {
      // 서버가 { isSuccess:false, code, message }를 돌려주면 그 message를 그대로 보여 줘요. (409 중복, 400 검증)
      if (isHTTPError(error)) {
        const body = await error.response.json<ApiEnvelope<null>>().catch(() => null);
        alert(body?.message ?? "회원가입에 실패했어요. 다시 시도해 주세요.");
      } else {
        alert("회원가입에 실패했어요. 다시 시도해 주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const duplicateButton = (key: DuplicateCheckKey, isValid: boolean) => (
    <button
      type="button"
      className={SECONDARY_BUTTON_CLASS}
      disabled={!isValid || duplicateCheck[key].isChecking}
      onClick={() => handleCheckDuplicate(key)}
    >
      {duplicateCheck[key].isChecking ? "확인 중" : duplicateCheck[key].isAvailable ? "확인 완료" : "중복 확인"}
    </button>
  );

  return (
    <AuthCard title="회원가입">
      {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔 */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="이메일"
          error={showEmailError ? "이메일 형식을 확인해 주세요." : null}
          action={duplicateButton("email", isEmailValid)}
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            className={cn(INPUT_CLASS, showEmailError && INPUT_ERROR_CLASS)}
            value={form.email}
            disabled={duplicateCheck.email.isChecking}
            onChange={(event) => handleChangeField("email", event.target.value)}
          />
        </FormField>

        <FormField
          id="nickname"
          label="닉네임"
          error={showNicknameError ? "닉네임은 2~12자로 입력해 주세요." : null}
          action={duplicateButton("nickname", isNicknameValid)}
        >
          <input
            id="nickname"
            type="text"
            autoComplete="nickname"
            placeholder="2~12자"
            className={cn(INPUT_CLASS, showNicknameError && INPUT_ERROR_CLASS)}
            value={form.nickname}
            disabled={duplicateCheck.nickname.isChecking}
            onChange={(event) => handleChangeField("nickname", event.target.value)}
          />
        </FormField>

        <FormField
          id="password"
          label="비밀번호"
          hint="영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요."
          error={showPasswordError ? "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상이어야 해요." : null}
        >
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="8자 이상"
            className={cn(INPUT_CLASS, showPasswordError && INPUT_ERROR_CLASS)}
            value={form.password}
            onChange={(event) => handleChangeField("password", event.target.value)}
          />
        </FormField>

        <FormField
          id="passwordConfirm"
          label="비밀번호 확인"
          error={showPasswordConfirmError ? "비밀번호가 일치하지 않아요." : null}
        >
          <input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="다시 입력"
            className={cn(INPUT_CLASS, showPasswordConfirmError && INPUT_ERROR_CLASS)}
            value={form.passwordConfirm}
            onChange={(event) => handleChangeField("passwordConfirm", event.target.value)}
          />
        </FormField>

        <button type="submit" className={cn(PRIMARY_BUTTON_CLASS, "mt-1 w-full")} disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="text-center text-xs text-text-secondary">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-action-primary hover:underline">
            로그인
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
