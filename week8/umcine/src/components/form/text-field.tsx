import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string | null;
  successMessage?: string | null;
  // 중복 확인 버튼처럼 입력칸 오른쪽에 붙는 요소
  action?: ReactNode;
}

export function TextField({
  label,
  errorMessage,
  successMessage,
  action,
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-900">
        {label}
        <div className="mt-2 flex gap-2">
          <input
            {...inputProps}
            aria-invalid={Boolean(errorMessage)}
            className={cn(
              "w-full rounded-md border bg-white px-3 py-2 text-sm font-normal disabled:bg-gray-100 disabled:text-gray-500",
              errorMessage ? "border-red-500" : "border-gray-300",
              className,
            )}
          />
          {action}
        </div>
      </label>
      {errorMessage ? (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      ) : successMessage ? (
        <p className="mt-2 text-sm text-blue-600">{successMessage}</p>
      ) : null}
    </div>
  );
}
