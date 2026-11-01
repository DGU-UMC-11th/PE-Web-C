import { useState, type SubmitEvent } from "react";
import { cn } from "../../utils/cn";

interface Review { rating: number; text: string }

function readReview(movieId: number): Review {
  try {
    const value = JSON.parse(localStorage.getItem("umcine:review:" + movieId) ?? "null") as Partial<Review> | null;
    if (value && Number.isInteger(value.rating) && value.rating! >= 1 && value.rating! <= 5 && typeof value.text === "string") return { rating: value.rating!, text: value.text };
  } catch {
    // The form is also available without browser storage.
  }
  return { rating: 0, text: "" };
}

export function MovieRating({ movieId }: { movieId: number }) {
  const [review, setReview] = useState(() => readReview(movieId));
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!review.rating) { setMessage("별점을 선택해 주세요."); return; }
    try {
      localStorage.setItem("umcine:review:" + movieId, JSON.stringify(review));
      setMessage("평점을 저장했어요.");
    } catch {
      setMessage("이 브라우저에서는 평점을 저장할 수 없어요.");
    }
  }

  return (
    <section aria-labelledby="rating-title" className="border-t border-[#dfe2e7] pt-6 lg:border-t-0 lg:border-l lg:pl-[30px] lg:pt-0">
      <h2 id="rating-title" className="text-xl font-extrabold">내 평점</h2>
      <p className="mt-1 mb-2 text-xs text-[#9a9fa8]">별점은 필수, 후기는 선택이에요.</p>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend className="sr-only">별점 선택 (필수)</legend>
          <div className="mb-2 flex gap-1" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} onMouseEnter={() => setHoveredRating(rating)} className={cn("relative flex size-[38px] cursor-pointer items-center justify-center rounded-lg border border-[#dfe2e7] bg-white text-[#656a73] transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-600", rating <= (hoveredRating || review.rating) && "border-blue-600 bg-blue-50 text-blue-600")}>
                <input type="radio" name="rating" value={rating} aria-label={rating + "점"} checked={review.rating === rating} onChange={() => { setReview({ ...review, rating }); setMessage(""); }} className="sr-only" />
                <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.1 6.6 7.2.6-5.5 4.7 1.7 7.1L12 17.3l-6.5 3.7 1.7-7.1L1.7 9.2l7.2-.6Z" /></svg>
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor="review-text" className="sr-only">영화 후기 (선택)</label>
        <textarea id="review-text" rows={4} maxLength={1000} value={review.text} onChange={(event) => { setReview({ ...review, text: event.target.value }); setMessage(""); }} placeholder="영화를 보고 느낀 점을 남겨보세요." className="block min-h-[102px] w-full resize-y rounded-lg border border-[#dfe2e7] bg-white p-3 text-xs leading-5 placeholder:text-[#9a9fa8]" />
        <button type="submit" className="mt-2 h-[42px] w-full rounded-lg bg-[#191b20] text-sm font-bold text-white hover:bg-[#30333a]">평점 저장</button>
        <p role="status" className="mt-2 min-h-5 text-xs text-[#656a73]">{message}</p>
      </form>
    </section>
  );
}
