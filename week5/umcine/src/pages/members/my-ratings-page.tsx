import { useEffect, useState, type SubmitEvent } from "react";
import { getMemberRatings } from "../../api/members";
import type { Rating } from "../../types/member";

const MAX_SCORE = 5;

export function MyRatingsPage() {
  const [memberIdText, setMemberIdText] = useState("1");
  const [memberId, setMemberId] = useState(1);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadRatings() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getMemberRatings(memberId);
        if (!ignore) setRatings(data);
      } catch (error) {
        if (!ignore) {
          setRatings([]);
          setErrorMessage(
            error instanceof Error ? error.message : "평점을 불러오지 못했어요."
          );
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadRatings();

    return () => {
      ignore = true;
    };
  }, [memberId]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setMemberId(Number(memberIdText));
  }

  return (
    <main className="mx-auto max-w-[800px] px-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold">내 평점</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          required
          min={1}
          type="number"
          aria-label="회원 ID"
          value={memberIdText}
          onChange={(event) => setMemberIdText(event.target.value)}
          className="w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-md border-none bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          조회
        </button>
      </form>

      {isLoading ? (
        <p className="mt-10 text-gray-500">불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="mt-10 text-red-600">{errorMessage}</p>
      ) : ratings.length === 0 ? (
        <p className="mt-10 text-gray-500">남긴 평점이 없어요.</p>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {ratings.map((rating) => (
            <li
              key={rating.ratingId}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900">
                  영화 ID {rating.movieId}
                </h2>
                <span className="text-yellow-500">
                  {"★".repeat(rating.score)}
                  {"☆".repeat(MAX_SCORE - rating.score)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{rating.comment}</p>
              <p className="mt-2 text-xs text-gray-500">
                {new Date(rating.createdAt).toLocaleDateString("ko-KR")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
