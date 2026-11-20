import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMyRatingsQuery, useRatingMutations } from "../../hooks/use-my-ratings";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface MyRatingPanelProps {
  movieId: number;
}

/**
 * 영화 상세의 "내 평점" 영역이에요.
 * 내 평점 목록에서 이 영화 것을 찾아, 없으면 POST /ratings, 있으면 PATCH /ratings/{id}를 보내요.
 */
export function MyRatingPanel({ movieId }: MyRatingPanelProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const myRatingsQuery = useMyRatingsQuery();

  const myRating = myRatingsQuery.data?.find((rating) => rating.movieId === movieId);

  return (
    <aside className="flex flex-col gap-2 border-border pb-10 lg:w-[360px] lg:border-l lg:pl-[30px]">
      <h2 className="text-[21px] font-bold tracking-[-0.63px] text-ink">내 평점</h2>

      {!accessToken ? (
        <>
          <p className="text-xs text-muted">평점을 남기려면 로그인이 필요해요.</p>
          <Link
            to="/login"
            className="mt-2 flex h-[42px] w-full items-center justify-center rounded-lg bg-ink text-sm font-extrabold text-white"
          >
            로그인하러 가기
          </Link>
        </>
      ) : myRatingsQuery.isPending ? (
        <p className="text-xs text-muted">불러오는 중이에요.</p>
      ) : (
        // 평점이 바뀌면 입력값도 새로 맞추도록 key로 리마운트해요.
        <RatingForm
          key={myRating?.ratingId ?? "new"}
          movieId={movieId}
          ratingId={myRating?.ratingId}
          initialScore={myRating?.score ?? 0}
          initialComment={myRating?.comment ?? ""}
        />
      )}
    </aside>
  );
}

interface RatingFormProps {
  movieId: number;
  ratingId?: number;
  initialScore: number;
  initialComment: string;
}

function RatingForm({
  movieId,
  ratingId,
  initialScore,
  initialComment,
}: RatingFormProps) {
  const [score, setScore] = useState(initialScore);
  const [comment, setComment] = useState(initialComment);

  const { create, update, remove, isPending } = useRatingMutations();

  const canSave = score >= 1 && score <= 5 && !isPending;

  const handleSave = () => {
    if (!canSave) return;

    if (ratingId) {
      update.mutate({ ratingId, score, comment: comment.trim() || undefined });
    } else {
      create.mutate({ movieId, score, comment: comment.trim() || undefined });
    }
  };

  return (
    <>
      <p className="text-xs text-muted">별점은 필수, 후기는 선택이에요.</p>

      <RatingStars value={score} onChange={setScore} />

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        rows={3}
        maxLength={500}
        className="w-full resize-none rounded-lg border border-border px-3 py-4 text-[13px] text-ink outline-none placeholder:text-muted"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave}
        className="flex h-[42px] w-full items-center justify-center rounded-lg bg-ink text-sm font-extrabold text-white disabled:bg-muted"
      >
        {isPending ? "저장 중" : ratingId ? "평점 수정" : "평점 저장"}
      </button>

      {ratingId && (
        <button
          type="button"
          onClick={() => remove.mutate(ratingId)}
          disabled={isPending}
          className="flex h-[38px] w-full items-center justify-center rounded-lg border border-border text-xs font-bold text-secondary"
        >
          평점 삭제
        </button>
      )}
    </>
  );
}

interface RatingStarsProps {
  value: number;
  onChange: (value: number) => void;
}

function RatingStars({ value, onChange }: RatingStarsProps) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="영화 별점">
      {[1, 2, 3, 4, 5].map((score) => {
        const isFilled = score <= value;

        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={score === value}
            aria-label={`${score}점`}
            onClick={() => onChange(score)}
            className="flex size-[38px] items-center justify-center rounded-lg border border-border bg-surface"
          >
            <span
              className={cn(
                "icon size-6 text-muted [--icon-url:url('/icons/star-outline.svg')]",
                isFilled && "text-accent [--icon-url:url('/icons/star.svg')]",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
