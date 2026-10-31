# UMCine — 5주차 (TMDB API 연동)

4주차까지 로컬 더미 배열로 그리던 화면을 **TMDB API 실데이터**로 바꾼 버전이에요.

## 실행 전 준비

### 1. TMDB 토큰

[TMDB](https://www.themoviedb.org/settings/api)에서 **API Read Access Token**을 발급받아요.

```bash
cp .env.example .env.local
```

`.env.local`을 열어 토큰을 채워요. (`.gitignore`의 `*.local` 규칙으로 Git에 안 올라가요.)

```txt
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=발급받은_토큰
```

> 환경 변수를 만들거나 바꾼 뒤에는 개발 서버를 **다시 시작**해야 반영돼요.

### 2. 실행

```bash
pnpm install
pnpm dev
```

## 구조

```
src/
├── config/env.ts                   # 환경 변수를 한 곳에서 읽고 누락이면 바로 에러
├── api/
│   ├── tmdb-client.ts              # ky 인스턴스 (base URL + Authorization)
│   └── movies/
│       ├── models.ts               # TMDB 응답 모델 (snake_case 그대로)
│       ├── get-movies-with-fetch.ts # 순수 fetch 버전 (비교용)
│       ├── get-movies.ts           # 인기 영화
│       ├── search-movies.ts        # 검색
│       └── get-movie-detail.ts     # 상세
├── utils/movies/
│   ├── tmdb-image.ts               # poster_path → 이미지 URL (없으면 null)
│   ├── format-movie.ts             # runtime 분 → "2시간 19분", 날짜 포맷
│   └── get-movie-detail-error-message.ts  # 404와 그 외 오류 구분
├── components/
│   ├── common/async-state.tsx      # 오류 / 빈 결과 공통 표시
│   └── movies/
│       ├── movie-poster.tsx        # 이미지 없을 때 "이미지 없음" 영역
│       └── movie-grid-skeleton.tsx # 로딩 skeleton
└── pages/movies/                   # 목록 · 검색 · 상세 (로딩/오류/빈결과/성공)
```

## 화면 상태 4가지

세 화면 모두 같은 순서로 분기해요.

```
로딩  →  오류  →  빈 결과  →  성공
```

| 화면 | 로딩 | 오류 | 빈 결과 |
|---|---|---|---|
| 목록 | 카드 모양 skeleton | 문구 + 다시 시도 | 조건에 맞는 영화가 없어요. |
| 검색 | 리스트 skeleton | 문구 + 다시 시도 | 검색 결과가 없어요. |
| 상세 | 안내 문구 | 404면 "영화를 찾을 수 없어요." / 그 외 일반 문구 | — |

검색은 **빈 검색어 안내를 먼저** 구분하고, 그 뒤에 위 4단계를 적용해요.

## fetch와 ky

`get-movies-with-fetch.ts`는 라이브러리 없이 요청하는 버전이에요.
base URL, `Authorization` header, query 조립, `response.ok` 확인을 전부 직접 씁니다.

`fetch`는 **네트워크 자체가 실패할 때만** reject해요.
404나 500 응답은 reject되지 않으므로 `response.ok`를 직접 확인해야 해요.

ky 인스턴스는 그 반복을 한 번만 설정해 두고,
성공 범위가 아닌 status에서는 알아서 `HTTPError`를 던져요.

> 설치된 ky는 **1.x**라서 `prefixUrl` / `HTTPError` 클래스를 사용해요.
> (워크북 예제의 `baseUrl` / `isHTTPError`는 ky 2.x 문법이에요.)

## 선택 미션 반영 내역

1. **다시 시도 버튼** — `retryCount` state를 Effect 의존성에 넣어 마지막 요청을 재실행
2. **페이지 번호를 search param으로** — `/?page=3`, 새로고침·뒤로가기에도 유지되고 TMDB의 `page` query와 연결

## 요청 경쟁 처리

Effect의 정리 함수에서 `ignore = true`로 바꿔요.
요청 자체를 취소하는 건 아니고, **늦게 도착한 이전 응답이 현재 상태를 덮어쓰지 못하게** 막는 거예요.
검색어를 빠르게 바꿀 때 이전 검색 결과가 뒤늦게 화면에 나타나는 문제를 방지해요.

> 개발 모드의 Strict Mode에서는 Effect가 한 번 더 실행돼서
> Network 패널에 같은 요청이 두 번 보일 수 있어요. 정상이에요.
