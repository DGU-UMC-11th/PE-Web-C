
import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080";

type CheckResponse = {
  available: boolean;
};

type Rating = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const [nickname, setNickname] = useState("수현");
  const [email, setEmail] = useState("noco@umc.com");
  const [memberId, setMemberId] = useState("1");

  const [nicknameResult, setNicknameResult] =
    useState<CheckResponse | null>(null);
  const [emailResult, setEmailResult] =
    useState<CheckResponse | null>(null);
  const [ratings, setRatings] = useState<Rating[] | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}${path}`);

    if (!response.ok) {
      throw new Error(`요청 실패 (${response.status})`);
    }

    return response.json() as Promise<T>;
  }

  async function checkNickname() {
    setError("");
    setNicknameResult(null);
    setLoading(true);

    try {
      const data = await request<CheckResponse>(
        `/members/nickname/${encodeURIComponent(nickname.trim())}`
      );
      setNicknameResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function checkEmail() {
    setError("");
    setEmailResult(null);
    setLoading(true);

    try {
      const data = await request<CheckResponse>(
        `/members/email/${encodeURIComponent(email.trim())}`
      );
      setEmailResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function getRatings() {
    setError("");
    setRatings(null);
    setLoading(true);

    try {
      const data = await request<Rating[]>(
        `/members/${encodeURIComponent(memberId.trim())}/ratings`
      );
      setRatings(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>Movie Rating</h1>
        <p>회원 정보 및 평점 조회</p>
      </header>

      <section className="card">
        <h2>닉네임 중복 확인</h2>
        <div className="input-row">
          <input
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameResult(null);
            }}
            placeholder="닉네임 입력"
          />
          <button
            onClick={checkNickname}
            disabled={loading || !nickname.trim()}
          >
            확인
          </button>
        </div>

        {nicknameResult && (
          <p className={
            nicknameResult.available ? "success" : "failure"
          }>
            {nicknameResult.available
              ? "사용 가능한 닉네임입니다."
              : "이미 사용 중인 닉네임입니다."}
          </p>
        )}
      </section>

      <section className="card">
        <h2>이메일 중복 확인</h2>
        <div className="input-row">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailResult(null);
            }}
            placeholder="이메일 입력"
          />
          <button
            onClick={checkEmail}
            disabled={loading || !email.trim()}
          >
            확인
          </button>
        </div>

        {emailResult && (
          <p className={
            emailResult.available ? "success" : "failure"
          }>
            {emailResult.available
              ? "사용 가능한 이메일입니다."
              : "이미 사용 중인 이메일입니다."}
          </p>
        )}
      </section>

      <section className="card">
        <h2>회원별 평점 조회</h2>
        <div className="input-row">
          <input
            type="number"
            min="1"
            value={memberId}
            onChange={(e) => {
              setMemberId(e.target.value);
              setRatings(null);
            }}
            placeholder="회원 ID"
          />
          <button
            onClick={getRatings}
            disabled={loading || !/^[1-9]\d*$/.test(memberId)}
          >
            조회
          </button>
        </div>

        {ratings !== null && (
          <div className="rating-list">
            <p className="count">평점 {ratings.length}건</p>

            {ratings.length === 0 && (
              <p className="empty">등록된 평점이 없습니다.</p>
            )}

            {ratings.map((rating) => (
              <div key={rating.ratingId} className="rating-item">
                <div className="rating-top">
                  <strong>영화 ID: {rating.movieId}</strong>
                  <span>★ {rating.score}/5</span>
                </div>
                <p>{rating.comment ?? "코멘트 없음"}</p>
                <small>
                  {rating.createdAt.replace("T", " ").slice(0, 19)}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      {loading && <p className="loading">불러오는 중...</p>}
      {error && <p className="error">{error}</p>}
    </main>
  );
}

export default App;
