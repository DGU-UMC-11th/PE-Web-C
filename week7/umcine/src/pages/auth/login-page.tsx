import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { TextField } from "../../components/form/text-field";
import { EMAIL_REGEX } from "../../utils/members/validation";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type FormKey = keyof typeof DEFAULT_FORM;

// 7주차는 화면만 만들고, POST /auth/login 연동은 8주차에 붙여요.
export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const showEmailError = form.email.length > 0 && !isEmailValid;
  // 로그인에서는 비밀번호 규칙을 검사하지 않고 입력 여부만 봐요.
  const canSubmit = isEmailValid && form.password.length > 0;

  function handleChangeField(key: FormKey, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    alert(`${form.email.trim()} 계정의 로그인은 8주차에 API와 연결해요.`);
  }

  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold">로그인</h1>
      <p className="mt-2 text-sm text-gray-500">
        로그인하고 보고 싶은 영화에 평점을 남겨 보세요.
      </p>

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
          onChange={(event) => handleChangeField("email", event.target.value)}
          errorMessage={
            showEmailError ? "올바른 이메일 형식이 아니에요." : null
          }
        />

        <TextField
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력해 주세요"
          value={form.password}
          onChange={(event) =>
            handleChangeField("password", event.target.value)
          }
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-2 cursor-pointer rounded-md border-none bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          로그인
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        아직 계정이 없나요?{" "}
        <Link to="/signup" className="font-semibold text-blue-600 no-underline">
          회원가입
        </Link>
      </p>
    </main>
  );
}
