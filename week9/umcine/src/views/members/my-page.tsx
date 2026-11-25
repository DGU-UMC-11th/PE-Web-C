"use client";

import Link from "next/link";
import { MovieLinkCard } from "../../components/movies/movie-link-card";
import { useFavoritesQuery } from "../../hooks/use-favorites";
import { useMeQuery } from "../../hooks/use-me-query";
import { useMyRatingsQuery } from "../../hooks/use-my-ratings";

const MAX_SCORE = 5;

export function MyPage() {
  return (
    <main className="mx-auto max-w-[800px] px-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      <MyInfoSection />
      <FavoritesSection />
      <MyRatingsSection />
    </main>
  );
}

function MyInfoSection() {
  const meQuery = useMeQuery();

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">내 정보</h2>
        <Link
          href="/me/edit"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white no-underline"
        >
          내 정보 수정
        </Link>
      </div>

      {meQuery.isPending ? (
        <p className="mt-4 text-sm text-gray-500">내 정보를 불러오는 중이에요.</p>
      ) : meQuery.isError ? (
        <p className="mt-4 text-sm text-red-600">내 정보를 불러오지 못했어요.</p>
      ) : (
        <dl className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          <InfoRow label="이메일" value={meQuery.data.email} />
          <InfoRow label="닉네임" value={meQuery.data.nickname} />
          <InfoRow
            label="가입일"
            value={new Date(meQuery.data.createdAt).toLocaleDateString("ko-KR")}
          />
        </dl>
      )}
    </section>
  );
}

function FavoritesSection() {
  const favoritesQuery = useFavoritesQuery();

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-gray-900">즐겨찾기한 영화</h2>
      {favoritesQuery.isPending ? (
        <p className="mt-4 text-sm text-gray-500">즐겨찾기를 불러오는 중이에요.</p>
      ) : favoritesQuery.isError ? (
        <p className="mt-4 text-sm text-red-600">즐겨찾기를 불러오지 못했어요.</p>
      ) : favoritesQuery.data.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">즐겨찾기한 영화가 없어요.</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {favoritesQuery.data.map((favorite) => (
            <li key={favorite.favoriteId}>
              <MovieLinkCard movieId={favorite.movieId}>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(favorite.createdAt).toLocaleDateString("ko-KR")}{" "}
                  추가
                </p>
              </MovieLinkCard>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function MyRatingsSection() {
  const myRatingsQuery = useMyRatingsQuery();

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-gray-900">내 평점</h2>
      {myRatingsQuery.isPending ? (
        <p className="mt-4 text-sm text-gray-500">내 평점을 불러오는 중이에요.</p>
      ) : myRatingsQuery.isError ? (
        <p className="mt-4 text-sm text-red-600">내 평점을 불러오지 못했어요.</p>
      ) : myRatingsQuery.data.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">남긴 평점이 없어요.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {myRatingsQuery.data.map((rating) => (
            <li key={rating.ratingId}>
              <MovieLinkCard movieId={rating.movieId}>
                <p className="mt-1 text-yellow-500">
                  {"★".repeat(rating.score)}
                  <span className="text-gray-300">
                    {"★".repeat(MAX_SCORE - rating.score)}
                  </span>
                </p>
                {rating.comment && (
                  <p className="mt-1 text-sm text-gray-700">{rating.comment}</p>
                )}
              </MovieLinkCard>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <dt className="text-sm font-semibold text-gray-500">{label}</dt>
      <dd className="min-w-0 truncate text-sm text-gray-900">{value}</dd>
    </div>
  );
}
