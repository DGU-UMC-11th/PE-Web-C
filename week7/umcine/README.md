# UMCine — 7주차 (인증 개념과 회원가입)

6주차 영화 조회 화면 위에 **회원가입 · 로그인 · 내 정보** 화면을 더했어요.
로그인과 내 정보 API 연동은 8주차에서 붙입니다.

## 실행

```bash
cp .env.example .env.local   # TMDB 토큰과 서버 주소를 채워요
pnpm install
pnpm dev
```

```txt
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=eyJ...        # TMDB API Read Access Token
VITE_API_BASE_URL=http://localhost:8080   # 우리 서버(Spring)
```

> 회원가입과 중복 확인은 **백엔드(8080)가 켜져 있어야** 동작해요.

## 화면

| 경로 | 화면 | 이번 주차 범위 |
|---|---|---|
| `/signup` | 회원가입 | 검증 + 중복 확인 + `POST /members` 연동 |
| `/login` | 로그인 | 퍼블리싱 (API는 8주차) |
| `/me` | 내 정보 조회 | 퍼블리싱 (API는 8주차) |
| `/me/edit` | 내 정보 수정 | 퍼블리싱 (닉네임 변경이 화면에 반영) |

## 폴더 구조 (선택 미션)

로그인이 필요한 화면과 그렇지 않은 화면을 폴더로 갈라뒀어요.

```
src/
├── api/
│   ├── api-client.ts            # 우리 서버용 ky 인스턴스
│   ├── tmdb-client.ts           # TMDB용 ky 인스턴스 (토큰 헤더 포함)
│   └── members/                 # 중복 확인 · 회원가입 요청 함수
├── pages/
│   ├── auth/                    # 로그인 전 화면 (회원가입 · 로그인)
│   ├── members/                 # 로그인 후 화면 (내 정보 조회 · 수정)
│   └── movies/                  # 누구나 볼 수 있는 화면
├── routes/
│   ├── signup.tsx  login.tsx
│   └── me/                      # 로그인이 필요한 경로를 한 폴더에 모음
│       ├── index.tsx            # /me
│       └── edit.tsx             # /me/edit
└── components/form/text-field.tsx  # 세 폼이 공유하는 입력칸
```

`routes/me/` 로 묶어두면 8주차에 로그인 가드(레이아웃 라우트)를 붙일 때
이 폴더 하나에만 적용하면 돼요. 이번 주차에는 접근 제한을 구현하지 않아요.

## 회원가입 검증 규칙

| 필드 | 규칙 |
|---|---|
| 이메일 | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| 닉네임 | 2~12자 |
| 비밀번호 | 대문자·소문자·숫자·특수문자(`!@#$%^&*`) 모두 포함 8자 이상 |
| 비밀번호 확인 | 비밀번호와 일치 |

- 입력을 **시작한 필드에만** 오류를 보여줘요. (처음부터 빨간 글씨가 뜨지 않게)
- `noValidate`로 브라우저 기본 검사를 끄고 우리가 직접 안내해요.
- 정규식에 `g` 플래그를 붙이면 `test()`가 `lastIndex`를 들고 다녀서 같은 값인데도 결과가 번갈아 나와요. 그래서 붙이지 않았어요.

## 중복 확인

- `GET /members/email/{email}` · `GET /members/nickname/{nickname}`
- 응답의 `available`이 `true`면 사용 가능
- **확인한 값을 다시 바꾸면 확인 결과를 초기화**해요. 그러지 않으면 "확인은 A로 해놓고 가입은 B로" 하는 구멍이 생겨요.
- 요청 중에는 해당 입력칸과 버튼을 비활성화해요.
- 입력 조건 + 두 중복 확인을 모두 통과해야 `가입하기`가 활성화돼요.

## 회원가입 요청

`POST /members` — `passwordConfirm`은 화면에서만 쓰고 **요청 바디에 넣지 않아요.**

```json
{ "email": "...", "nickname": "...", "password": "..." }
```

성공하면 서버가 준 `message`를 그대로 안내하고 `/login`으로 이동해요.
실패해도 입력값을 유지해서 바로 다시 시도할 수 있어요.

> 요청 상태(`isSubmitting`)와 성공·실패 처리를 직접 쓰고 있는데,
> 8주차에서 `useMutation`으로 정리할 예정이에요.

## ky 1.x 주의

설치된 ky는 1.x라서 워크북의 `baseUrl` 대신 **`prefixUrl`** 을 써요.
`prefixUrl`을 쓰면 각 요청 경로가 `/`로 시작하면 안 돼요. (`members/...`)
