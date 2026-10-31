interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

// 오류 상태 공통 표시예요. onRetry를 넘기면 "다시 시도" 버튼이 함께 나와요.
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex w-full flex-col items-center gap-4 py-24 text-center"
    >
      <p className="text-muted">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex h-[42px] items-center justify-center rounded-lg bg-ink px-4 text-sm font-extrabold text-white"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return <p className="w-full py-24 text-center text-muted">{message}</p>;
}
