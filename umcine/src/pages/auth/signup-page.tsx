import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";

// 이메일 형식 검사
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

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];
type DuplicateCheckKey = "email" | "nickname";

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-600 disabled:bg-gray-50";
const LABEL_CLASS = "text-xs font-semibold text-gray-900";
const ERROR_CLASS = "text-[11px] text-red-500";
const CHECK_BUTTON_CLASS =
  "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:no-underline";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const signupMutation = useSignupMutation();

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 true
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
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
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
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

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    if (!canSubmit || signupMutation.isPending) return;

    signupMutation.mutate({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
  };

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="mx-auto w-full max-w-[430px] px-6 py-24">
      <form
        id="signup-form"
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold">회원가입</h1>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={LABEL_CLASS}>
            이메일
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              disabled={duplicateCheck.email.isChecking}
              placeholder="name@example.com"
              className={`${INPUT_CLASS} pr-20`}
            />
            <button
              type="button"
              disabled={!isEmailValid || duplicateCheck.email.isChecking}
              onClick={() => handleCheckDuplicate("email")}
              className={CHECK_BUTTON_CLASS}
            >
              {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showEmailError && (
            <p className={ERROR_CLASS}>이메일 형식을 확인해 주세요.</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nickname" className={LABEL_CLASS}>
            닉네임
          </label>
          <div className="relative">
            <input
              id="nickname"
              type="text"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              disabled={duplicateCheck.nickname.isChecking}
              placeholder="2~12자"
              className={`${INPUT_CLASS} pr-20`}
            />
            <button
              type="button"
              disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
              onClick={() => handleCheckDuplicate("nickname")}
              className={CHECK_BUTTON_CLASS}
            >
              {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
            </button>
          </div>
          {showNicknameError && (
            <p className={ERROR_CLASS}>닉네임은 2~12자로 입력해 주세요.</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className={LABEL_CLASS}>
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            placeholder="8자 이상"
            className={INPUT_CLASS}
          />
          <p className="text-[11px] text-gray-400">
            영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.
          </p>
          {showPasswordError && (
            <p className={ERROR_CLASS}>비밀번호를 다시 한 번 확인해주세요.</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="passwordConfirm" className={LABEL_CLASS}>
            비밀번호 확인
          </label>
          <input
            id="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            onChange={(e) =>
              handleChangeField("passwordConfirm", e.target.value)
            }
            placeholder="다시 입력"
            className={INPUT_CLASS}
          />
          {showPasswordConfirmError && (
            <p className={ERROR_CLASS}>비밀번호가 일치하지 않아요.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || signupMutation.isPending}
          className="mt-2 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {signupMutation.isPending ? "가입 중" : "가입하기"}
        </button>

        <p className="text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
