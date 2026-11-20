import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string | null;
  helperMessage?: string | null;
  /** 이메일·닉네임의 "중복 확인" 버튼처럼 입력칸 오른쪽에 붙는 요소 */
  trailing?: ReactNode;
}

// 회원가입·로그인·내 정보 수정 화면이 같은 입력칸을 쓰도록 하나로 묶었어요.
export function TextField({
  label,
  errorMessage,
  helperMessage,
  trailing,
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <span className="text-sm font-bold text-ink">{label}</span>

      <span className="flex items-center gap-2">
        <input
          {...inputProps}
          className={cn(
            "h-[50px] min-w-0 flex-1 rounded-[10px] border bg-surface px-[15px] text-sm text-ink outline-none placeholder:text-muted",
            "disabled:bg-surface-hover disabled:text-muted",
            errorMessage ? "border-danger" : "border-border",
            className,
          )}
        />
        {trailing}
      </span>

      {errorMessage ? (
        <span className="text-xs text-danger">{errorMessage}</span>
      ) : helperMessage ? (
        <span className="text-xs text-muted">{helperMessage}</span>
      ) : null}
    </label>
  );
}
