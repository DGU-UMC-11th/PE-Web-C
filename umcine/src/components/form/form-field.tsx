import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface FormFieldProps {
  id: string;
  label: string;
  /** 입력 아래에 항상 보여 주는 안내 문구 */
  hint?: string;
  /** 있으면 빨간색으로 표시하고 hint 대신 보여 줘요 */
  error?: string | null;
  /** 입력 오른쪽에 붙는 버튼(중복 확인 등) */
  action?: ReactNode;
  children: ReactNode;
}

// 라벨 + 입력 + 안내/오류 문구를 디자인과 같은 간격으로 묶어 주는 공통 컴포넌트예요.
export function FormField({ id, label, hint, error, action, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold text-text-primary">
        {label}
      </label>
      <div className="flex gap-2">
        {children}
        {action}
      </div>
      {error ? (
        <p className="text-xs text-danger-default" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
}

export const INPUT_CLASS =
  "h-[42px] min-w-0 flex-1 rounded-lg border border-border-default bg-bg-surface px-3 text-sm text-text-primary outline-none placeholder:text-text-tertiary focus:border-action-primary disabled:bg-bg-page disabled:text-text-secondary";

export const INPUT_ERROR_CLASS = "border-danger-default focus:border-danger-default";

export const PRIMARY_BUTTON_CLASS =
  "flex h-[42px] items-center justify-center rounded-lg bg-action-primary px-4 text-sm font-extrabold whitespace-nowrap text-bg-surface hover:bg-action-hover active:bg-action-pressed disabled:cursor-not-allowed disabled:bg-action-disabled";

export const SECONDARY_BUTTON_CLASS =
  "flex h-[42px] items-center justify-center rounded-lg border border-border-default bg-bg-surface px-4 text-sm font-bold whitespace-nowrap text-action-primary hover:bg-bg-page disabled:cursor-not-allowed disabled:text-text-tertiary";

interface IconInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: string;
  hasError?: boolean;
}

// 로그인 화면처럼 입력 왼쪽에 아이콘이 들어가는 입력
export function IconInput({ icon, hasError, className, ...props }: IconInputProps) {
  return (
    <div className="relative flex flex-1">
      <img
        src={icon}
        alt=""
        width={18}
        height={18}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-60"
      />
      <input {...props} className={cn(INPUT_CLASS, "pl-10", hasError && INPUT_ERROR_CLASS, className)} />
    </div>
  );
}

// 로그인·회원가입처럼 가운데 카드 하나만 있는 화면의 공통 틀
export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex w-full flex-1 items-start justify-center px-4 py-16 sm:py-24">
      <div className="flex w-full max-w-[420px] flex-col gap-6">
        <h1 className="text-[30px] leading-tight font-bold tracking-[-1px] text-text-primary">{title}</h1>
        {children}
      </div>
    </main>
  );
}
