import { cn } from "../../utils/cn";

interface StatusMessageProps {
  children: React.ReactNode;
  tone?: "default" | "error";
}

// 로딩·오류·빈 결과 안내 문구를 같은 모양으로 보여 줘요.
export function StatusMessage({ children, tone = "default" }: StatusMessageProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-[10px] border border-border-default bg-bg-surface px-4 py-6 text-center text-sm",
        tone === "error" ? "text-danger-default" : "text-text-secondary",
      )}
    >
      {children}
    </p>
  );
}
