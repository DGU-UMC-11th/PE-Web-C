import { useState } from "react";

type AvailableResponse = {
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

export default function ApiTestPage() {
  const [nicknameResult, setNicknameResult] =
    useState<AvailableResponse | null>(null);

  const [emailResult, setEmailResult] = useState<AvailableResponse | null>(
    null,
  );

  const [ratings, setRatings] = useState<Rating[]>([]);

  const checkNickname = async () => {
    const response = await fetch("http://localhost:8080/members/nickname/수현");

    const data: AvailableResponse = await response.json();

    setNicknameResult(data);
  };

  const checkEmail = async () => {
    const response = await fetch(
      "http://localhost:8080/members/email/noco@umc.com",
    );

    const data: AvailableResponse = await response.json();

    setEmailResult(data);
  };

  const getRatings = async () => {
    const response = await fetch(
      "http://localhost:8080/members/1/ratings?page=0&size=10",
    );

    const data = await response.json();

    setRatings(data.content);
  };

  return (
    <main>
      <h1>5주차 API 연결 테스트</h1>

      <section>
        <h2>닉네임 중복 확인</h2>

        <button onClick={checkNickname}>수현 중복 확인</button>

        {nicknameResult && <pre>{JSON.stringify(nicknameResult, null, 2)}</pre>}
      </section>

      <section>
        <h2>이메일 중복 확인</h2>

        <button onClick={checkEmail}>noco@umc.com 중복 확인</button>

        {emailResult && <pre>{JSON.stringify(emailResult, null, 2)}</pre>}
      </section>

      <section>
        <h2>회원 평점 조회</h2>

        <button onClick={getRatings}>1번 회원 평점 조회</button>

        {ratings.length > 0 && <pre>{JSON.stringify(ratings, null, 2)}</pre>}
      </section>
    </main>
  );
}
