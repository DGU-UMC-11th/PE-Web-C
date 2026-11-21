import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import type { Rating, RatingInput } from "../../api/ratings/ratings";
import { useMemberRatings, useRatingMutation } from "../../hooks/use-member-ratings";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { getMemberErrorMessage } from "../../utils/get-member-error-message";
import { getTokenMemberId } from "../../utils/get-token-member-id";
import { secondaryButtonClass } from "../auth/auth-ui";

const EMPTY_RATING: RatingInput = { score: 0, comment: "" };

function RatingForm({ movieId, memberId, savedRating, accessToken, isFetching }: {
  movieId: number;
  memberId: number;
  savedRating: Rating | undefined;
  accessToken: string;
  isFetching: boolean;
}) {
  const [draft, setDraft] = useState<RatingInput | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const mutation = useRatingMutation(movieId, memberId);
  const review = draft ?? savedRating ?? EMPTY_RATING;
  const comment = review.comment ?? "";
  const isBusy = mutation.isPending || isFetching;

  function changeDraft(nextDraft: RatingInput) {
    setDraft(nextDraft);
    mutation.reset();
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!review.score || isBusy || useAuthStore.getState().accessToken !== accessToken) return;

    const input = { score: review.score, comment: comment.trim() };
    mutation.mutate({
      accessToken,
      change: savedRating
        ? { action: "update", ratingId: savedRating.ratingId, input }
        : { action: "create", input },
    }, { onSuccess: () => setDraft(null) });
  }

  function handleDelete() {
    if (!savedRating || isBusy || useAuthStore.getState().accessToken !== accessToken) return;
    mutation.mutate({ accessToken, change: { action: "delete", ratingId: savedRating.ratingId } },
      { onSuccess: () => setDraft(null) });
  }

  return (
    <>
      <p className="mt-1 mb-2 text-xs text-[#656a73]">별점은 필수, 후기는 선택이에요.</p>
      <form onSubmit={handleSubmit} aria-busy={mutation.isPending}>
        <fieldset disabled={isBusy}>
          <legend className="sr-only">별점 선택 (필수)</legend>
          <div className="mb-2 flex gap-1" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map((score) => (
              <label key={score} onMouseEnter={() => setHoveredRating(score)}
                className={cn(
                  "relative flex size-[38px] cursor-pointer items-center justify-center rounded-lg border border-[#dfe2e7] bg-white text-[#656a73] transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-600",
                  score <= (hoveredRating || review.score) && "border-blue-600 bg-blue-50 text-blue-600",
                )}>
                <input type="radio" name="rating" value={score} aria-label={`${score}점`} required checked={review.score === score}
                  onChange={() => changeDraft({ score, comment })} className="sr-only" />
                <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 2 3.1 6.6 7.2.6-5.5 4.7 1.7 7.1L12 17.3l-6.5 3.7 1.7-7.1L1.7 9.2l7.2-.6Z" />
                </svg>
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor="review-text" className="sr-only">영화 후기 (선택)</label>
        <textarea id="review-text" rows={4} maxLength={500} value={comment} disabled={isBusy}
          onChange={(event) => changeDraft({ score: review.score, comment: event.target.value })}
          placeholder="영화를 보고 느낀 점을 남겨보세요."
          className="block min-h-[102px] w-full resize-y rounded-lg border border-[#dfe2e7] bg-white p-3 text-xs leading-5 placeholder:text-[#9a9fa8]" />
        <div className="mt-2 flex gap-2">
          <button type="submit" disabled={isBusy || !review.score}
            className="h-[42px] flex-1 rounded-lg bg-[#191b20] px-3 text-sm font-bold text-white hover:bg-[#30333a] disabled:opacity-50">
            {mutation.isPending ? "처리 중" : savedRating ? "평점 수정" : "평점 저장"}
          </button>
          {savedRating && (
            <button type="button" disabled={isBusy} onClick={handleDelete}
              className="h-[42px] rounded-lg border border-[#dfe2e7] px-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
              평점 삭제
            </button>
          )}
        </div>
        {mutation.isError && <p role="alert" className="mt-2 text-xs text-red-700">
          {getMemberErrorMessage(mutation.error, "평점을 변경하지 못했어요. 다시 시도해 주세요.")}
        </p>}
        {mutation.isSuccess && <p role="status" className="mt-2 text-xs text-green-700">
          {mutation.variables.change.action === "delete" ? "평점을 삭제했어요." : "평점을 저장했어요."}
        </p>}
      </form>
    </>
  );
}

function MemberRating({ movieId, accessToken }: { movieId: number; accessToken: string }) {
  const memberId = getTokenMemberId(accessToken);
  const ratings = useMemberRatings(memberId);

  if (memberId === undefined) {
    return <p role="alert" className="mt-2 text-sm text-red-700">회원 번호를 확인하지 못했어요. 다시 로그인해 주세요.</p>;
  }

  if (ratings.isPending) {
    return <p role="status" className="mt-2 text-sm text-[#656a73]">내 평점을 불러오는 중이에요.</p>;
  }

  if (ratings.isError) {
    return (
      <div className="mt-2 space-y-2">
        <p role="alert" className="text-sm text-red-700">{getMemberErrorMessage(ratings.error, "내 평점을 불러오지 못했어요.")}</p>
        <button type="button" className={secondaryButtonClass} disabled={ratings.isFetching}
          onClick={() => void ratings.refetch()}>다시 시도</button>
      </div>
    );
  }

  return (
    <RatingForm key={memberId} movieId={movieId} memberId={memberId} accessToken={accessToken}
      savedRating={ratings.data?.find((rating) => rating.movieId === movieId)} isFetching={ratings.isFetching} />
  );
}

export function MovieRating({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <section aria-labelledby="rating-title" className="border-t border-[#dfe2e7] pt-6 lg:border-t-0 lg:border-l lg:pl-[30px] lg:pt-0">
      <h2 id="rating-title" className="text-xl font-extrabold">내 평점</h2>
      {accessToken ? <MemberRating movieId={movieId} accessToken={accessToken} /> : (
        <Link to="/login" className="mt-2 inline-block text-sm font-bold text-blue-600 hover:underline">로그인하고 평점 남기기</Link>
      )}
    </section>
  );
}
