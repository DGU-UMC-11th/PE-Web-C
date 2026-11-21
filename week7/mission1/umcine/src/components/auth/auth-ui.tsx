import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils/cn";

export const primaryButtonClass = "flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#e8e9ed] disabled:text-[#9a9fa8]";
export const secondaryButtonClass = "flex min-h-12 items-center justify-center rounded-lg border border-[#dfe2e7] bg-white px-4 py-3 text-sm font-bold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-[#f6f7f9] disabled:text-[#9a9fa8]";

export function AuthCard({ title, description, children }: {
  title: string; description: string; children: ReactNode;
}) {
  return (
    <main className="flex flex-1 justify-center px-4 py-12 sm:py-16">
      <section aria-label={title} className="h-fit w-full max-w-[480px] rounded-2xl border border-[#e8e9ed] bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8">
          <p className="mb-3 text-xs font-extrabold tracking-widest text-blue-600">UMCine</p>
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-[#656a73]">{description}</p>
        </div>
        {children}
      </section>
    </main>
  );
}

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string; label: string; error?: string; hint?: string;
  success?: string; action?: ReactNode;
};

export function AuthField({ id, label, error, hint, success, action, type = "text", className, ...props }: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const message = error || success || hint;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold">{label}</label>
      <div className="flex items-start gap-2">
        <div className="relative min-w-0 flex-1">
          <input {...props} id={id} type={isPassword && showPassword ? "text" : type}
            aria-invalid={Boolean(error)} aria-describedby={message ? `${id}-message` : undefined}
            className={cn("h-12 w-full rounded-lg border bg-white px-3 text-sm placeholder:text-[#9a9fa8] disabled:bg-[#f6f7f9] disabled:text-[#656a73]", error ? "border-red-500" : "border-[#dfe2e7]", isPassword && "pr-14", className)} />
          {isPassword && <button type="button" disabled={props.disabled}
            aria-label={`${label} ${showPassword ? "숨기기" : "보기"}`} aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-1 right-1 rounded-md px-2 text-xs font-bold text-[#656a73] hover:bg-gray-50">
            {showPassword ? "숨김" : "보기"}
          </button>}
        </div>
        {action}
      </div>
      {message && <p id={`${id}-message`} aria-live="polite"
        className={cn("mt-2 text-xs leading-5", error ? "text-red-600" : success ? "text-green-700" : "text-[#656a73]")}>{message}</p>}
    </div>
  );
}
