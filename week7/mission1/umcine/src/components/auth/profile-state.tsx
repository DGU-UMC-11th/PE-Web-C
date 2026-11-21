import { Link } from "@tanstack/react-router";
import { AuthCard, primaryButtonClass, secondaryButtonClass } from "./auth-ui";

export function ProfileState({ isLoggedIn, isPending, message, onRetry }: {
  isLoggedIn: boolean; isPending: boolean; message: string; onRetry: () => void;
}) {
  return (
    <AuthCard title="내 정보" description={isLoggedIn ? "나의 프로필 정보를 확인하고 수정해 보세요." : "내 정보를 보려면 로그인해 주세요."}>
      {!isLoggedIn ? <Link to="/login" className={primaryButtonClass}>로그인하기</Link>
        : isPending ? <p role="status" className="text-sm text-[#656a73]">내 정보를 불러오는 중이에요.</p>
        : <div className="space-y-4"><p role="alert" className="text-sm text-red-600">{message}</p>
          <button type="button" onClick={onRetry} className={secondaryButtonClass}>다시 시도</button></div>}
    </AuthCard>
  );
}
