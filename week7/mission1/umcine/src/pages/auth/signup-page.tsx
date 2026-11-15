import { useRef, useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { AuthCard, AuthField, primaryButtonClass, secondaryButtonClass } from "../../components/auth/auth-ui";
import { EMAIL_REGEX, PASSWORD_REGEX, isNicknameValid as validateNickname } from "../../utils/auth-validation";
import { getMemberErrorMessage } from "../../utils/get-member-error-message";

const DEFAULT_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateKey = "email" | "nickname";
type DuplicateCheck = { isChecking: boolean; isAvailable: boolean; message: string };
const DEFAULT_CHECK: DuplicateCheck = { isChecking: false, isAvailable: false, message: "" };

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({ email: DEFAULT_CHECK, nickname: DEFAULT_CHECK });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  // state가 렌더링되기 전의 연속 클릭도 막아요.
  const pending = useRef({ email: false, nickname: false, submit: false });

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = validateNickname(form.nickname);
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const canSubmit = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid &&
    duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: FormKey, value: string) {
    if (pending.current.submit || ((key === "email" || key === "nickname") && pending.current[key])) return;
    if (key === "email" || key === "nickname") {
      // 중복 확인한 값과 실제 제출 값이 달라지지 않도록 결과를 초기화해요.
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_CHECK }));
    }
    setSubmitError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateKey) {
    if (!(key === "email" ? isEmailValid : isNicknameValid) || pending.current[key] || pending.current.submit) return;
    pending.current[key] = true;
    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({ ...prev, [key]: { ...DEFAULT_CHECK, isChecking: true } }));
    try {
      const response = key === "email"
        ? await checkEmailDuplicate(form.email.trim())
        : await checkNicknameDuplicate(form.nickname.trim());
      if (typeof response.available !== "boolean") throw new Error("잘못된 중복 확인 응답");
      const message = response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`;
      setDuplicateCheck((prev) => ({ ...prev, [key]: { isChecking: false, isAvailable: response.available, message } }));
    } catch (error) {
      const message = getMemberErrorMessage(error, "중복 확인에 실패했어요. 회원 서버를 확인하고 다시 시도해 주세요.");
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...DEFAULT_CHECK, message } }));
    } finally {
      pending.current[key] = false;
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isChecking: false } }));
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || pending.current.submit || pending.current.email || pending.current.nickname) return;
    pending.current.submit = true;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await signup({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
      if (!response.isSuccess) throw new Error(response.message || "회원가입에 실패했어요.");
      setSubmitSuccess(response.message || "회원가입에 성공했어요.");
      setForm(DEFAULT_FORM);
    } catch (error) {
      const message = getMemberErrorMessage(error,
        error instanceof Error && error.message !== "Failed to fetch" && error.name === "Error"
          ? error.message : "회원가입에 실패했어요. 회원 서버를 확인하고 다시 시도해 주세요.");
      setSubmitError(message);
    } finally {
      pending.current.submit = false;
      setIsSubmitting(false);
    }
  }

  const duplicateButton = (key: DuplicateKey, valid: boolean) => (
    <button type="button" className={`${secondaryButtonClass} shrink-0 px-3`}
      disabled={!valid || duplicateCheck[key].isChecking || isSubmitting}
      onClick={() => void handleCheckDuplicate(key)} aria-label={`${key === "email" ? "이메일" : "닉네임"} 중복 확인`}>
      {duplicateCheck[key].isChecking ? "확인 중" : "중복 확인"}
    </button>
  );

  if (submitSuccess) {
    return <AuthCard title="가입 완료" description={submitSuccess}>
      <p role="status" className="mb-6 text-sm text-green-700">가입한 계정으로 로그인해 주세요.</p>
      <Link to="/login" className={primaryButtonClass}>로그인하러 가기</Link>
    </AuthCard>;
  }

  return (
    <AuthCard title="회원가입" description="UMCine에서 나만의 영화 취향을 찾아보세요.">
      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting} className="space-y-5">
        <AuthField id="signup-email" label="이메일" type="email" autoComplete="email" placeholder="example@email.com"
          value={form.email} onChange={(e) => handleChangeField("email", e.target.value)}
          disabled={isSubmitting || duplicateCheck.email.isChecking}
          error={form.email.length > 0 && !isEmailValid ? "올바른 이메일 형식으로 입력해 주세요." : !duplicateCheck.email.isAvailable ? duplicateCheck.email.message : undefined}
          success={duplicateCheck.email.isAvailable ? duplicateCheck.email.message : undefined}
          action={duplicateButton("email", isEmailValid)} />
        <AuthField id="signup-nickname" label="닉네임" autoComplete="nickname" placeholder="닉네임을 입력해 주세요"
          value={form.nickname} onChange={(e) => handleChangeField("nickname", e.target.value)}
          disabled={isSubmitting || duplicateCheck.nickname.isChecking} hint="앞뒤 공백을 제외하고 2~12자로 입력해 주세요."
          error={form.nickname.length > 0 && !isNicknameValid ? "닉네임은 2~12자로 입력해 주세요." : !duplicateCheck.nickname.isAvailable ? duplicateCheck.nickname.message : undefined}
          success={duplicateCheck.nickname.isAvailable ? duplicateCheck.nickname.message : undefined}
          action={duplicateButton("nickname", isNicknameValid)} />
        <AuthField id="signup-password" label="비밀번호" type="password" autoComplete="new-password" placeholder="비밀번호를 입력해 주세요"
          value={form.password} onChange={(e) => handleChangeField("password", e.target.value)} disabled={isSubmitting}
          hint="영문 대문자·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요."
          error={form.password.length > 0 && !isPasswordValid ? "대문자·소문자·숫자·특수문자(!@#$%^&*)를 포함해 8자 이상이어야 해요." : undefined} />
        <AuthField id="signup-password-confirm" label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="비밀번호를 한 번 더 입력해 주세요"
          value={form.passwordConfirm} onChange={(e) => handleChangeField("passwordConfirm", e.target.value)} disabled={isSubmitting}
          error={form.passwordConfirm.length > 0 && !isPasswordConfirmValid ? "비밀번호가 일치하지 않아요." : undefined} />
        {submitError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}
        <button type="submit" disabled={!canSubmit || isSubmitting} className={primaryButtonClass}>{isSubmitting ? "가입 중" : "가입하기"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-[#656a73]">이미 계정이 있으신가요? <Link to="/login" className="ml-1 font-bold text-blue-600 hover:underline">로그인</Link></p>
    </AuthCard>
  );
}
