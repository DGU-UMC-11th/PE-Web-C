import { checkEmail, checkNickname } from "../../api/members";
import { AvailabilityField } from "../../components/members/availability-field";

export function SignupPage() {
  return (
    <main className="mx-auto max-w-md px-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <div className="mt-8 flex flex-col gap-6">
        <AvailabilityField
          label="이메일"
          type="email"
          placeholder="이메일을 입력해 주세요"
          check={checkEmail}
        />
        <AvailabilityField
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력해 주세요"
          check={checkNickname}
        />
      </div>
    </main>
  );
}
