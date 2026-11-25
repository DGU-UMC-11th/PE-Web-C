"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { useMyRatingsQuery, useRatingMutations } from "../../hooks/use-my-ratings";
import { useAuthStore } from "../../stores/auth-store";
import type { Rating } from "../../types/member";
import { cn } from "../../utils/cn";

const SCORES = [1, 2, 3, 4, 5];
const MAX_COMMENT_LENGTH = 500;

interface MyRatingPanelProps {
  movieId: number;
}

export function MyRatingPanel({ movieId }: MyRatingPanelProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const myRatingsQuery = useMyRatingsQuery();

  if (!accessToken) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold text-gray-900">내 평점</h2>
        <p className="mt-2 text-sm text-gray-500">
          <Link href="/login" className="font-semibold text-blue-600 no-underline">
            로그인
          </Link>
          하면 이 영화에 평점을 남길 수 있어요.
        </p>
      </section>
    );
  }

  if (myRatingsQuery.isPending) {
    return <p className="text-sm text-gray-500">내 평점을 불러오는 중이에요.</p>;
  }

  if (myRatingsQuery.isError) {
    return <p className="text-sm text-red-600">내 평점을 불러오지 못했어요.</p>;
  }

  // 영화별 평점 조회 API가 없어서 내 평점 목록에서 이 영화를 찾아요.
  const myRating =
    myRatingsQuery.data.find((rating) => rating.movieId === movieId) ?? null;

  // key로 평점이 바뀔 때 폼 입력값을 새로 맞춰요.
  return (
    <RatingForm
      key={myRating ? `${myRating.ratingId}-${myRating.updatedAt}` : "new"}
      movieId={movieId}
      myRating={myRating}
    />
  );
}

interface RatingFormProps {
  movieId: number;
  myRating: Rating | null;
}

function RatingForm({ movieId, myRating }: RatingFormProps) {
  const [score, setScore] = useState(myRating?.score ?? 0);
  const [comment, setComment] = useState(myRating?.comment ?? "");
  const { createMutation, updateMutation, deleteMutation } =
    useRatingMutations();

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const trimmedComment = comment.trim();
  const isChanged =
    !myRating ||
    score !== myRating.score ||
    trimmedComment !== (myRating.comment ?? "");
  const canSubmit = score >= 1 && isChanged && !isPending;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const body = {
      score,
      ...(trimmedComment ? { comment: trimmedComment } : {}),
    };
    if (myRating) {
      updateMutation.mutate({ ratingId: myRating.ratingId, ...body });
    } else {
      createMutation.mutate({ movieId, ...body });
    }
  }

  function handleDelete() {
    if (!myRating || isPending) return;
    if (!confirm("이 영화에 남긴 평점을 삭제할까요?")) return;
    deleteMutation.mutate(myRating.ratingId);
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-bold text-gray-900">
        {myRating ? "내 평점" : "평점 남기기"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="flex gap-1" role="radiogroup" aria-label="별점">
          {SCORES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={score === value}
              aria-label={`${value}점`}
              disabled={isPending}
              onClick={() => setScore(value)}
              className={cn(
                "cursor-pointer border-none bg-transparent p-0 text-2xl",
                value <= score ? "text-yellow-500" : "text-gray-300",
              )}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          maxLength={MAX_COMMENT_LENGTH}
          disabled={isPending}
          placeholder="후기를 남겨 주세요 (선택, 500자 이하)"
          onChange={(event) => setComment(event.target.value)}
          className="min-h-24 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="cursor-pointer rounded-md border-none bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {createMutation.isPending || updateMutation.isPending
              ? "저장 중"
              : myRating
                ? "수정하기"
                : "등록하기"}
          </button>
          {myRating && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleDelete}
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              {deleteMutation.isPending ? "삭제 중" : "삭제하기"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
