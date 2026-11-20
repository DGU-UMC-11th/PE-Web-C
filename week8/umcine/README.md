# UMCine — 8주차 (useMutation과 캐시 갱신)

7주차까지 퍼블리싱만 해둔 로그인·내 정보 화면에 API를 붙이고,
요청 상태 관리를 `useMutation`으로 옮긴 버전이에요. 즐겨찾기와 평점도 서버와 연결했어요.

## 실행

```bash
cp .env.example .env.local   # TMDB 토큰 + 서버 주소
pnpm install
pnpm dev
```

```txt
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=eyJ...
VITE_API_BASE_URL=http://localhost:8080
```

> 로그인·즐겨찾기·평점은 **백엔드(8080)가 켜져 있어야** 동작해요.

## 7주차와 달라진 것

| | 7주차 | 8주차 |
|---|---|---|
| 요청 상태 | `isSubmitting` + `try/catch` | `useMutation` (`isPending` / `onSuccess` / `onError`) |
| 로그인 | 화면만 | `POST /auth/login` → 토큰 저장 |
| 토큰 | 없음 | zustand `persist` → `localStorage` |
| 인증 헤더 | 없음 | `authApi`의 `beforeRequest`가 자동으로 붙임 |
| 내 정보 | 임시 store | `GET /members/me` (query 캐시) |
| 즐겨찾기 | `localStorage` 북마크 | 서버 `favorites` API |

## 토큰과 인증 요청

```
apiClient (서버 주소)
   └─ authApi = apiClient.extend({ hooks })
        beforeRequest  → store의 지금 토큰을 Authorization 헤더에 넣음
        afterResponse  → 401이면 토큰을 비움 (만료·위조된 토큰을 들고 있을 이유가 없음)
```

- 로그인·회원가입·중복 확인·공개 평점 조회 → `apiClient`
- 내 정보·즐겨찾기·평점 쓰기 → `authApi`

> 설치된 ky는 **1.x**라 hook이 `(request, options, response)` 형태로 인자를 받아요.
> 워크북 예제의 `({ request })` 는 2.x 문법이에요.

## invalidateQueries vs setQueryData (선택 미션)

둘 다 써보고 Network 탭에서 비교했어요.

| | 쓴 곳 | 추가 요청 | 언제 쓰나 |
|---|---|---|---|
| `invalidateQueries` | 로그인 성공 후 `["members","me"]` | **생김** (GET /members/me) | 서버만 아는 값이 바뀌었을 때, 응답에 새 상태가 없을 때 |
| `setQueryData` | 닉네임 수정 성공 후 | **없음** | 응답 `result`가 조회 결과와 같은 형태일 때 |

`PATCH /members/me`의 응답은 내 정보 조회와 형태가 같아서, 그 값을 그대로 캐시에 넣으면
한 번 더 조회할 이유가 없어요. 로그인은 반대로 조회 결과 자체가 없던 상태라 무효화해서 새로 받아왔어요.

즐겨찾기는 목록(`["favorites","list"]`)과 단건 여부(`["favorites","status",movieId]`)가 함께 달라지므로
`["favorites"]` 상위 key를 무효화해 둘 다 갱신했어요. (key는 **부분 일치**로 무효화돼요)

## 로그인 전용 폴더 (필수 미션)

```
src/routes/
├── login.tsx                 beforeLoad: 이미 로그인했으면 "/" 로 redirect
└── _authenticated.tsx        Layout Route — 토큰 없으면 /login 으로 redirect + <Outlet />
    ├── me.index.tsx          /me       마이페이지
    └── me.edit.tsx           /me/edit  내 정보 수정
```

- 파일명이 `_`로 시작하면 **주소에는 나타나지 않는 레이아웃**이에요. `/me`, `/me/edit` 그대로 유지돼요.
- 로그인 검사가 레이아웃 한 곳에 있어서, 보호할 화면이 늘어나도 폴더에 파일만 추가하면 돼요.
- `me.tsx`가 아니라 **`me.index.tsx`** 인 게 중요해요. `me.tsx`로 두면 `/me`가 `/me/edit`의 **부모**가 되어서, `<Outlet />` 없이는 자식 화면이 아예 안 그려져요. (실제로 이 문제를 겪고 바꿨어요)

## 연결한 API

| 화면 | API |
|---|---|
| 회원가입 | `POST /members`, `GET /members/email/{email}`, `GET /members/nickname/{nickname}` |
| 로그인 | `POST /auth/login` |
| 헤더·마이페이지 | `GET /members/me` |
| 내 정보 수정 | `PATCH /members/me` |
| 마이페이지 | `GET /favorites` (+ TMDB 상세로 제목·포스터) |
| 영화 상세 | `GET /favorites/{movieId}`, `POST /favorites`, `DELETE /favorites/{movieId}` |
| 영화 상세 | `GET /members/{memberId}/ratings`, `POST /ratings`, `PATCH /ratings/{ratingId}`, `DELETE /ratings/{ratingId}` |

- 목록·검색 카드의 즐겨찾기 버튼은 **목록 조회 한 번**으로 모든 카드의 상태를 판단해요. (카드마다 단건 조회하면 요청이 N번 생겨요)
- 상세 화면은 그 영화 하나만 보면 되므로 **단건 여부 조회**를 써요.
- 내 평점은 `GET /members/{memberId}/ratings`에서 이 영화 것을 찾아, 없으면 `POST`, 있으면 `PATCH`로 보내요.

> `memberId`는 `GET /members/me` 응답에 담아 받아요. 평점 조회가 공개 API라 경로에 `memberId`가 필요한데,
> 토큰을 직접 해석하는 것보다 서버가 알려주는 편이 안전해요.

## 확인한 동작

- 로그인 전 `/me` 접근 → `/login`으로 이동
- 로그인 → `localStorage`에 토큰 저장 + 헤더가 닉네임으로 바뀜
- 로그인 상태에서 `/login` 접근 → 홈으로 이동
- 상세에서 즐겨찾기 토글 → 마이페이지 목록에 반영
- 평점 저장 → 버튼이 "평점 수정"으로 바뀌고 삭제 버튼이 생김
- 닉네임 수정 → **`GET /members/me` 추가 요청 없이** 헤더·마이페이지가 바로 갱신
