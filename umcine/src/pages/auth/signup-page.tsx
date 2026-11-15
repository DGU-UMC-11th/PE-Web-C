import { Link } from "@tanstack/react-router";
import { HTTPError } from "ky";
import { useRef, useState, type FormEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

type CheckStatus = "idle" | "checking" | "available" | "duplicate" | "error";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [emailStatus, setEmailStatus] = useState<CheckStatus>("idle");
  const [nicknameStatus, setNicknameStatus] = useState<CheckStatus>("idle");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const emailVersion = useRef(0);
  const nicknameVersion = useRef(0);
  const submittingRef = useRef(false);

  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(password);

  const isPasswordConfirmValid =
    passwordConfirm.length > 0 && password === passwordConfirm;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    emailStatus === "available" &&
    nicknameStatus === "available" &&
    !isSubmitting &&
    !isSignupSuccess;

  const handleEmailChange = (value: string) => {
    emailVersion.current += 1;
    setEmail(value);
    setEmailStatus("idle");
    setSubmitError("");
  };

  const handleNicknameChange = (value: string) => {
    nicknameVersion.current += 1;
    setNickname(value);
    setNicknameStatus("idle");
    setSubmitError("");
  };

  const handleCheckEmail = async () => {
    if (
      !isEmailValid ||
      emailStatus === "checking" ||
      isSubmitting ||
      isSignupSuccess
    ) {
      return;
    }

    const version = emailVersion.current;
    const currentEmail = email.trim();

    setEmailStatus("checking");
    setSubmitError("");

    try {
      const response = await checkEmailDuplicate(currentEmail);

      if (emailVersion.current !== version) return;

      setEmailStatus(response.available ? "available" : "duplicate");
    } catch {
      if (emailVersion.current !== version) return;
      setEmailStatus("error");
    }
  };

  const handleCheckNickname = async () => {
    if (
      !isNicknameValid ||
      nicknameStatus === "checking" ||
      isSubmitting ||
      isSignupSuccess
    ) {
      return;
    }

    const version = nicknameVersion.current;
    const currentNickname = nickname.trim();

    setNicknameStatus("checking");
    setSubmitError("");

    try {
      const response = await checkNicknameDuplicate(currentNickname);

      if (nicknameVersion.current !== version) return;

      setNicknameStatus(response.available ? "available" : "duplicate");
    } catch {
      if (nicknameVersion.current !== version) return;
      setNicknameStatus("error");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await signup({
        email: email.trim(),
        nickname: nickname.trim(),
        password,
      });

      if (!response.isSuccess) {
        setSubmitError(response.message || "회원가입에 실패했습니다.");
        return;
      }

      setIsSignupSuccess(true);
      setPassword("");
      setPasswordConfirm("");
    } catch (error) {
      if (error instanceof HTTPError) {
        if (error.response.status === 409) {
          setSubmitError(
            "이미 사용 중인 이메일 또는 닉네임입니다. 중복 확인을 다시 해주세요.",
          );

          setEmailStatus("idle");
          setNicknameStatus("idle");
        } else if (error.response.status === 400) {
          setSubmitError("입력 정보를 확인한 후 다시 시도해 주세요.");
        } else {
          setSubmitError("회원가입 요청에 실패했습니다. 다시 시도해 주세요.");
        }
      } else {
        setSubmitError(
          "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-lg border border-[#d5dae2] px-4 py-3 text-sm outline-none focus:border-[#2563eb] disabled:bg-[#f8fafc]";

  const checkButtonClassName =
    "shrink-0 rounded-lg bg-[#2563eb] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50";

  const isInputDisabled = isSubmitting || isSignupSuccess;

  return (
    <main className="min-h-[calc(100vh-91px)] bg-[#f8fafc] px-5 py-16">
      <div className="mx-auto w-full max-w-[440px] rounded-2xl border border-[#e3e6eb] bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-[28px] font-extrabold text-[#17191e]">
          회원가입
        </h1>

        <p className="mb-8 text-center text-sm text-[#606774]">
          UMCine에서 사용할 계정을 만들어 주세요.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-[#17191e]"
            >
              이메일
            </label>

            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => handleEmailChange(event.target.value)}
                placeholder="이메일을 입력해 주세요"
                disabled={isInputDisabled}
                className={`${inputClassName} min-w-0`}
              />

              <button
                type="button"
                onClick={handleCheckEmail}
                disabled={
                  !isEmailValid || emailStatus === "checking" || isInputDisabled
                }
                className={checkButtonClassName}
              >
                {emailStatus === "checking" ? "확인 중..." : "중복 확인"}
              </button>
            </div>

            {email.length > 0 && !isEmailValid && (
              <p className="mt-2 text-xs text-red-500">
                올바른 이메일 형식으로 입력해 주세요.
              </p>
            )}

            {isEmailValid && emailStatus === "idle" && (
              <p className="mt-2 text-xs text-green-600">
                올바른 이메일 형식입니다. 중복 확인을 해주세요.
              </p>
            )}

            {emailStatus === "checking" && (
              <p className="mt-2 text-xs text-[#606774]">
                이메일 중복 확인 중입니다.
              </p>
            )}

            {emailStatus === "available" && (
              <p className="mt-2 text-xs text-green-600">
                사용 가능한 이메일입니다.
              </p>
            )}

            {emailStatus === "duplicate" && (
              <p className="mt-2 text-xs text-red-500">
                이미 사용 중인 이메일입니다.
              </p>
            )}

            {emailStatus === "error" && (
              <p className="mt-2 text-xs text-red-500">
                중복 확인에 실패했습니다. 다시 시도해 주세요.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="nickname"
              className="mb-2 block text-sm font-bold text-[#17191e]"
            >
              닉네임
            </label>

            <div className="flex gap-2">
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(event) => handleNicknameChange(event.target.value)}
                placeholder="닉네임을 입력해 주세요"
                disabled={isInputDisabled}
                className={`${inputClassName} min-w-0`}
              />

              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={
                  !isNicknameValid ||
                  nicknameStatus === "checking" ||
                  isInputDisabled
                }
                className={checkButtonClassName}
              >
                {nicknameStatus === "checking" ? "확인 중..." : "중복 확인"}
              </button>
            </div>

            {nickname.length > 0 && !isNicknameValid && (
              <p className="mt-2 text-xs text-red-500">
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}

            {isNicknameValid && nicknameStatus === "idle" && (
              <p className="mt-2 text-xs text-green-600">
                사용 가능한 길이의 닉네임입니다. 중복 확인을 해주세요.
              </p>
            )}

            {nicknameStatus === "checking" && (
              <p className="mt-2 text-xs text-[#606774]">
                닉네임 중복 확인 중입니다.
              </p>
            )}

            {nicknameStatus === "available" && (
              <p className="mt-2 text-xs text-green-600">
                사용 가능한 닉네임입니다.
              </p>
            )}

            {nicknameStatus === "duplicate" && (
              <p className="mt-2 text-xs text-red-500">
                이미 사용 중인 닉네임입니다.
              </p>
            )}

            {nicknameStatus === "error" && (
              <p className="mt-2 text-xs text-red-500">
                중복 확인에 실패했습니다. 다시 시도해 주세요.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-bold text-[#17191e]"
            >
              비밀번호
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setSubmitError("");
              }}
              placeholder="비밀번호를 입력해 주세요"
              disabled={isInputDisabled}
              className={inputClassName}
            />

            {password.length > 0 && (
              <p
                className={`mt-2 text-xs ${
                  isPasswordValid ? "text-green-600" : "text-red-500"
                }`}
              >
                {isPasswordValid
                  ? "비밀번호 조건을 만족합니다."
                  : "대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 포함한 8자 이상이어야 합니다."}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="mb-2 block text-sm font-bold text-[#17191e]"
            >
              비밀번호 확인
            </label>

            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
                setSubmitError("");
              }}
              placeholder="비밀번호를 다시 입력해 주세요"
              disabled={isInputDisabled}
              className={inputClassName}
            />

            {passwordConfirm.length > 0 && (
              <p
                className={`mt-2 text-xs ${
                  isPasswordConfirmValid ? "text-green-600" : "text-red-500"
                }`}
              >
                {isPasswordConfirmValid
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            )}
          </div>

          {submitError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {submitError}
            </p>
          )}

          {isSignupSuccess && (
            <div
              role="status"
              className="rounded-lg bg-green-50 p-4 text-center"
            >
              <p className="font-bold text-green-700">
                회원가입이 완료되었습니다!
              </p>
              <Link
                to="/login"
                className="mt-2 inline-block text-sm font-bold text-[#2563eb]"
              >
                로그인하러 가기
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-[#2563eb] py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "가입 중..."
              : isSignupSuccess
                ? "가입 완료"
                : "가입하기"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#606774]">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="font-bold text-[#2563eb]">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
