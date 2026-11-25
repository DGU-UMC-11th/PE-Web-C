import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { TextField } from "../../components/form/text-field";
import { useSignupMutation } from "../../hooks/use-signup-mutation";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  isValidNickname,
} from "../../utils/members/validation";

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

type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

const DUPLICATE_CHECK_LABEL: Record<DuplicateCheckKey, string> = {
  email: "이메일",
  nickname: "닉네임",
};

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  // 요청 진행·성공·실패 상태는 useMutation이 관리해요.
  const signupMutation = useSignupMutation();

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = isValidNickname(form.nickname);
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류를 보여줘요.
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;
  // 입력 조건과 두 중복 확인을 모두 통과해야 제출할 수 있어요.
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: FormKey, value: string) {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 해요.
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = DUPLICATE_CHECK_LABEL[key];
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const { available } =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: available },
      }));
      alert(
        available
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
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    // 폼 제출 시 페이지 새로고침 방지
    event.preventDefault();
    if (!canSubmit || signupMutation.isPending) return;

    // 성공 처리는 onSuccess, 실패 처리는 onError로 옮겼어요.
    signupMutation.mutate({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
  }

  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <p className="mt-2 text-sm text-gray-500">
        UMCine에서 평점을 남기려면 계정이 필요해요.
      </p>

      {/* noValidate: 브라우저 기본 유효성 검사 대신 직접 검사한 결과를 보여줘요. */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 flex flex-col gap-6"
      >
        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력해 주세요"
          value={form.email}
          disabled={duplicateCheck.email.isChecking}
          onChange={(event) => handleChangeField("email", event.target.value)}
          errorMessage={
            showEmailError ? "올바른 이메일 형식이 아니에요." : null
          }
          successMessage={
            duplicateCheck.email.isAvailable
              ? "사용할 수 있는 이메일이에요."
              : null
          }
          action={
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
          placeholder="2~12자로 입력해 주세요"
          value={form.nickname}
          disabled={duplicateCheck.nickname.isChecking}
          onChange={(event) =>
            handleChangeField("nickname", event.target.value)
          }
          errorMessage={
            showNicknameError ? "닉네임은 2자 이상 12자 이하로 입력해 주세요." : null
          }
          successMessage={
            duplicateCheck.nickname.isAvailable
              ? "사용할 수 있는 닉네임이에요."
              : null
          }
          action={
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
          placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
          value={form.password}
          onChange={(event) =>
            handleChangeField("password", event.target.value)
          }
          errorMessage={
            showPasswordError
              ? "영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요."
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
          disabled={!canSubmit || signupMutation.isPending}
          className="mt-2 cursor-pointer rounded-md border-none bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {signupMutation.isPending ? "가입 중" : "가입하기"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        이미 계정이 있나요?{" "}
        <Link to="/login" className="font-semibold text-blue-600 no-underline">
          로그인
        </Link>
      </p>
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
      className="flex-shrink-0 cursor-pointer rounded-md border-none bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {isChecking ? "확인 중" : "중복 확인"}
    </button>
  );
}
