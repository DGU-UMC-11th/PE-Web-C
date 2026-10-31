# movie-api (5주차 — 영화 평점 서비스 백엔드)

Spring Boot 3.5 / Java 21 / MySQL 8 / Spring Data JPA

닉네임·이메일 중복 체크와 유저별 평점 조회 API를 제공하고,
프론트엔드(`http://localhost:5173`)에서 호출할 수 있도록 CORS를 설정했어요.

## 실행 순서

### 1. DB 준비

MySQL Workbench나 CLI에서 순서대로 실행해요.

```bash
mysql -u root -p < sql/01_schema.sql
mysql -u root -p < sql/02_seed.sql
```

`member`, `rating`, `favorite` 테이블이 만들어지고 시드 데이터가 들어가요.
(`favorite`은 8주차용이라 스키마만 만들어 둬요.)

### 2. 환경 변수

`DB_PASSWORD`에 로컬 MySQL 비밀번호를 넣어요.
IntelliJ라면 **Run/Debug Configurations → Environment variables** 에 추가해요.

```
DB_PASSWORD=본인_MySQL_비밀번호
```

### 3. 서버 실행

```bash
./gradlew bootRun
```

IntelliJ에서는 `MovieApplication`의 초록색 Run 버튼을 눌러도 돼요.
`http://localhost:8080` 에서 뜹니다.

> 프로젝트에 Gradle wrapper가 없다면 `gradle wrapper` 를 한 번 실행하거나,
> IntelliJ에서 열 때 번들 Gradle을 사용하도록 두면 돼요.

## API 명세

| API | Method | URL | Request | Success (200) |
|---|---|---|---|---|
| 닉네임 중복 체크 | GET | `/members/nickname/{nickname}` | Path: nickname (string) | `{ "available": true }` |
| 이메일 중복 체크 | GET | `/members/email/{email}` | Path: email (string) | `{ "available": true }` |
| 유저별 평점 조회 | GET | `/members/{memberId}/ratings` | Path: memberId (number)<br>Query(선택): page, size | `[{ "ratingId", "movieId", "score", "comment", "createdAt", "updatedAt" }]` |

`available`은 **아직 쓸 수 있으면 `true`** 예요. 이미 가입된 값이면 `false`가 나와요.

### 오류 응답

| 상황 | status | 본문 |
|---|---|---|
| 없는 유저의 평점 조회 | 404 | Spring 기본 오류 응답 |
| 닉네임 길이 위반 (2~12자 아님) | 400 | `{ "message": "닉네임은 2~12자로 입력해 주세요." }` |
| 이메일 형식 위반 | 400 | `{ "message": "이메일 형식이 올바르지 않습니다." }` |

## Postman 확인

```
GET http://localhost:8080/members/nickname/수현        → { "available": false }
GET http://localhost:8080/members/nickname/없는닉네임    → { "available": true }
GET http://localhost:8080/members/email/noco@umc.com   → { "available": false }
GET http://localhost:8080/members/1/ratings            → 평점 3건 (최신순)
GET http://localhost:8080/members/1/ratings?page=0&size=2  → 2건만
GET http://localhost:8080/members/999/ratings          → 404
GET http://localhost:8080/members/nickname/가          → 400
```

> 경로에 한글이 들어가면 클라이언트가 인식하지 못할 때가 있어요.
> 그럴 땐 값을 큰따옴표로 감싸서 요청해 보세요. (`.../nickname/"수현"`)

## CORS 확인 (mock-frontend)

```bash
cd mock-frontend
npx serve -l 5173
```

`http://localhost:5173` 에서 버튼을 누르면 4개 API를 호출해요.

- `WebConfig`를 **지우거나 주석 처리하고** 서버를 재시작하면 → Console에 CORS 에러
- 원래대로 두면 → 응답 JSON이 화면에 그대로 표시

CORS는 요청이 서버에 닿는 것을 막는 게 아니라,
**브라우저가 응답을 화면에 전달하기 직전에 가로막는 것**이에요.
그래서 서버 로그에는 정상 처리로 남는데 화면에는 아무것도 안 떠요.

## 패키지 구조

```
src/main/java/com/umc/movie
├── MovieApplication.java
├── config
│   ├── WebConfig.java              # CORS 설정 (허용 출처를 localhost:5173으로 한정)
│   └── GlobalExceptionHandler.java # 검증 실패를 400으로 변환 (선택 미션용 최소 구현)
├── controller
│   ├── MemberController.java       # /members/nickname, /members/email
│   └── RatingController.java       # /members/{memberId}/ratings
├── service
│   ├── MemberService.java
│   └── RatingService.java
├── repository
│   ├── MemberRepository.java       # existsByNickname / existsByEmail
│   └── RatingRepository.java       # findByMember_MemberIdOrderByRatingIdDesc
├── entity
│   ├── BaseTimeEntity.java         # createdAt / updatedAt 공통 상속
│   ├── Member.java
│   └── Rating.java
└── dto
    ├── NicknameCheckResponse.java
    ├── EmailCheckResponse.java
    ├── RatingResponse.java
    └── ErrorResponse.java
```

## 선택 미션 반영 내역

1. **닉네임/이메일 형식 검증** — `@Validated` + `@Size(2,12)` / `@Email`,
   실패 시 `GlobalExceptionHandler`가 400으로 변환
2. **평점 목록 페이지네이션** — `?page=0&size=10`,
   둘 다 없으면 기존처럼 전체 목록을 반환해 기본 명세를 깨지 않음
3. **CORS 허용 범위 좁히기** — `"*"` 대신 `http://localhost:5173` 만 허용.
   `"*"`는 어떤 사이트에서든 우리 API를 호출할 수 있게 되고,
   인증 쿠키를 함께 보내는 설정(`allowCredentials`)과는 아예 같이 쓸 수도 없어요.
   개발 단계에서도 실제 사용하는 출처만 적어 두는 편이 안전해요.
