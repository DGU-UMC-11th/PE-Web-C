import { Link } from "@tanstack/react-router";
import { isHTTPError, isNetworkError } from "ky";
import { useRef, useState, type SubmitEvent } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { AvailabilityResponse, MemberRating } from "../../api/members/models";
import { MoviePoster } from "../../components/movies/movie-poster";
import { StatusMessage } from "../../components/movies/status-message";
import { cn } from "../../utils/cn";

const INPUT_CLASS =
  "h-[42px] min-w-0 flex-1 rounded-lg border border-border-default bg-bg-surface px-3 text-sm outline-none placeholder:text-text-tertiary focus:border-action-primary";
const BUTTON_CLASS =
  "h-[42px] shrink-0 rounded-lg bg-action-primary px-4 text-sm font-extrabold text-bg-surface hover:bg-action-hover active:bg-action-pressed disabled:bg-action-disabled";

// 백엔드 요청이 실패한 이유를 사용자에게 보여 줄 문장으로 바꿔요.
function getServerErrorMessage(error: unknown) {
  if (isNetworkError(error)) {
    // 서버가 꺼져 있거나, CORS로 응답을 읽지 못하면 여기로 와요.
    return "백엔드 서버에 연결하지 못했어요. 서버가 켜져 있는지, CORS가 허용되어 있는지 확인해 주세요.";
  }
  if (isHTTPError(error)) {
    return `요청에 실패했어요. (HTTP ${error.response.status})`;
  }
  return "요청에 실패했어요.";
}

function ResponseJson({ data }: { data: unknown }) {
  return (
    <details className="text-xs text-text-secondary">
      <summary className="cursor-pointer select-none">서버 응답 JSON</summary>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-bg-page p-3">{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
}

interface AvailabilityCheckerProps {
  title: string;
  description: string;
  inputLabel: string;
  inputType: "text" | "email";
  placeholder: string;
  check: (value: string) => Promise<AvailabilityResponse>;
  availableText: string;
  unavailableText: string;
}

type AvailabilityState =
  | { status: "idle" }
  | { status: "loading"; value: string }
  | { status: "success"; value: string; data: AvailabilityResponse }
  | { status: "error"; value: string; message: string };

// 닉네임·이메일 중복 확인 카드 (같은 모양이라 하나로 만들었어요)
function AvailabilityChecker({
  title,
  description,
  inputLabel,
  inputType,
  placeholder,
  check,
  availableText,
  unavailableText,
}: AvailabilityCheckerProps) {
  const [input, setInput] = useState("");
  const [state, setState] = useState<AvailabilityState>({ status: "idle" });
  // 버튼을 연달아 눌렀을 때 늦게 도착한 이전 응답이 결과를 덮어쓰지 않게 요청 번호를 기억해요.
  const requestIdRef = useRef(0);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;

    const requestId = ++requestIdRef.current;
    setState({ status: "loading", value });

    try {
      const data = await check(value);
      if (requestId === requestIdRef.current) setState({ status: "success", value, data });
    } catch (error) {
      if (requestId === requestIdRef.current) {
        setState({ status: "error", value, message: getServerErrorMessage(error) });
      }
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-[10px] border border-border-default bg-bg-surface p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-extrabold">{title}</h2>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          aria-label={inputLabel}
          type={inputType}
          placeholder={placeholder}
          className={INPUT_CLASS}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit" className={BUTTON_CLASS} disabled={!input.trim() || state.status === "loading"}>
          중복 확인
        </button>
      </form>

      {state.status === "loading" && (
        <p role="status" className="text-sm text-text-secondary">
          ‘{state.value}’ 확인 중이에요.
        </p>
      )}
      {state.status === "error" && (
        <p role="alert" className="text-sm font-bold text-danger-default">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <>
          <p
            role="status"
            className={cn(
              "text-sm font-bold",
              state.data.available ? "text-action-primary" : "text-danger-default",
            )}
          >
            ‘{state.value}’{state.data.available ? availableText : unavailableText}
          </p>
          <ResponseJson data={state.data} />
        </>
      )}
    </section>
  );
}

interface RatedMovie {
  title: string;
  posterPath: string | null;
}

type RatingsState =
  | { status: "idle" }
  | { status: "loading"; memberId: number }
  | { status: "success"; memberId: number; ratings: MemberRating[]; movies: Record<number, RatedMovie> }
  | { status: "error"; message: string };

function formatDateTime(value: string) {
  // "2026-11-01T16:00:00" → "2026.11.01 16:00"
  const [date, time = ""] = value.split("T");
  return `${date.replaceAll("-", ".")} ${time.slice(0, 5)}`.trim();
}

function Stars({ score }: { score: number }) {
  return (
    <span aria-label={`5점 만점에 ${score}점`} className="text-sm font-bold text-text-primary">
      <span aria-hidden="true" className="text-[#f5a524]">
        {"★".repeat(score)}
        <span className="text-border-default">{"★".repeat(Math.max(0, 5 - score))}</span>
      </span>{" "}
      {score}점
    </span>
  );
}

// 회원별 평점 조회 카드: 우리 백엔드에서 평점을 받고, 영화 제목·포스터는 TMDB에서 받아 함께 보여 줘요.
function MemberRatings() {
  const [input, setInput] = useState("1");
  const [state, setState] = useState<RatingsState>({ status: "idle" });
  const requestIdRef = useRef(0);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const memberId = Number(input);

    if (!Number.isInteger(memberId) || memberId <= 0) {
      setState({ status: "error", message: "회원 번호는 1 이상의 정수로 입력해 주세요." });
      return;
    }

    const requestId = ++requestIdRef.current;
    setState({ status: "loading", memberId });

    try {
      const ratings = await getMemberRatings(memberId);

      // 평점에는 TMDB movieId만 있으므로, 화면에 보여 줄 제목·포스터는 TMDB 상세 API로 채워요.
      // 영화 하나가 실패해도 나머지는 보여 주도록 allSettled를 써요.
      const movieIds = [...new Set(ratings.map((rating) => rating.movieId))];
      const details = await Promise.allSettled(movieIds.map((movieId) => getMovieDetail(movieId)));
      const movies: Record<number, RatedMovie> = {};
      details.forEach((result, index) => {
        if (result.status === "fulfilled") {
          movies[movieIds[index]] = { title: result.value.title, posterPath: result.value.poster_path };
        }
      });

      if (requestId === requestIdRef.current) setState({ status: "success", memberId, ratings, movies });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      if (isHTTPError(error) && error.response.status === 404) {
        setState({ status: "error", message: `${memberId}번 회원은 존재하지 않아요.` });
      } else {
        setState({ status: "error", message: getServerErrorMessage(error) });
      }
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-[10px] border border-border-default bg-bg-surface p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-extrabold">회원별 평점 조회</h2>
        <p className="text-sm text-text-secondary">
          아직 로그인 기능이 없어서(7주차) 회원 번호로 조회해요. <code>GET /members/{"{memberId}"}/ratings</code>
        </p>
      </div>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          aria-label="회원 번호"
          inputMode="numeric"
          placeholder="회원 번호"
          className={INPUT_CLASS}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit" className={BUTTON_CLASS} disabled={!input.trim() || state.status === "loading"}>
          평점 조회
        </button>
      </form>

      {state.status === "loading" && <StatusMessage>{state.memberId}번 회원의 평점을 불러오는 중이에요.</StatusMessage>}
      {state.status === "error" && <StatusMessage tone="error">{state.message}</StatusMessage>}
      {state.status === "success" && (
        <>
          <p className="text-sm text-text-secondary">
            {state.memberId}번 회원 · 평점 {state.ratings.length}개 (최신순)
          </p>
          {state.ratings.length === 0 ? (
            <StatusMessage>아직 남긴 평점이 없어요.</StatusMessage>
          ) : (
            <ul className="flex flex-col gap-3">
              {state.ratings.map((rating) => {
                const movie = state.movies[rating.movieId];
                const title = movie?.title ?? `TMDB 영화 #${rating.movieId}`;
                return (
                  <li key={rating.ratingId} className="flex gap-4 rounded-lg border border-border-default p-3">
                    <MoviePoster
                      posterPath={movie?.posterPath ?? null}
                      title={title}
                      className="h-[96px] w-[64px] shrink-0 rounded-md"
                    />
                    <div className="flex min-w-0 flex-col gap-1">
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(rating.movieId) }}
                        className="text-base font-extrabold hover:underline"
                      >
                        {title}
                      </Link>
                      <Stars score={rating.score} />
                      <p className="text-sm text-text-secondary">{rating.comment || "코멘트 없음"}</p>
                      <p className="text-xs text-text-tertiary">{formatDateTime(rating.createdAt)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <ResponseJson data={state.ratings} />
        </>
      )}
    </section>
  );
}

export function MyPage() {
  return (
    <main className="flex w-full flex-1 flex-col gap-5 px-4 py-6 sm:px-10 lg:px-20">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">내 정보</h1>
      <p className="text-sm text-text-secondary">
        우리 백엔드(Spring Boot)의 5주차 API를 이 화면에서 호출해요. 회원가입·로그인은 6~7주차에 추가돼요.
      </p>
      <div className="grid w-full max-w-3xl gap-5">
        <AvailabilityChecker
          title="닉네임 중복 확인"
          description="GET /members/nickname/{nickname}"
          inputLabel="닉네임"
          inputType="text"
          placeholder="닉네임을 입력해 주세요"
          check={checkNickname}
          availableText="은(는) 사용할 수 있는 닉네임이에요."
          unavailableText="은(는) 이미 사용 중인 닉네임이에요."
        />
        <AvailabilityChecker
          title="이메일 중복 확인"
          description="GET /members/email/{email}"
          inputLabel="이메일"
          inputType="email"
          placeholder="이메일을 입력해 주세요"
          check={checkEmail}
          availableText="은(는) 사용할 수 있는 이메일이에요."
          unavailableText="은(는) 이미 가입된 이메일이에요."
        />
        <MemberRatings />
      </div>
    </main>
  );
}
