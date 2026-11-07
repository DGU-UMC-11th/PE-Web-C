# week6/be — 영화 평점 서비스 백엔드

Spring Boot 3.5 / Java 21 / MySQL 8 / Spring Data JPA

5주차의 조회 API에 **회원가입**과 **평점 등록·수정·삭제**를 더했어요.

## 실행

```bash
mysql -u root -p <DB이름> < sql/01_movie_schema.sql
mysql -u root -p <DB이름> < sql/02_movie_seed.sql
```

환경 변수 `DB_URL` / `DB_USER` / `DB_PW` 를 설정하고 `StudyApplication` 실행 → `http://localhost:8080`

## API

| 기능 | Method | 경로 | 성공 |
|---|---|---|---|
| 닉네임 중복 체크 | GET | `/members/nickname/{nickname}` | 200 |
| 이메일 중복 체크 | GET | `/members/email/{email}` | 200 |
| 유저별 평점 조회 | GET | `/members/{memberId}/ratings` | 200 |
| **회원가입** | POST | `/members` | **201** |
| **평점 등록** | POST | `/members/{memberId}/ratings` | **201** |
| **평점 수정** | PATCH | `/members/{memberId}/ratings/{ratingId}` | **200** |
| **평점 삭제** | DELETE | `/members/{memberId}/ratings/{ratingId}` | **204** |

## 공통 응답 형식

성공과 실패가 같은 틀을 쓰도록 `ApiResponse`로 감쌌어요.

```json
{ "isSuccess": true, "code": "COMMON201", "message": "회원가입에 성공했습니다.",
  "result": { "memberId": 1, "email": "umc@example.com", "nickname": "moviefan" } }
```

```json
{ "isSuccess": false, "code": "MEMBER4091", "message": "이미 사용 중인 이메일입니다.", "result": null }
```

## 오류 코드

| 상황 | status | code |
|---|---|---|
| 입력 형식 위반 | 400 | `COMMON4001` |
| 본문이 비었거나 JSON 깨짐 | 400 | `COMMON4000` |
| 이메일 중복 | 409 | `MEMBER4091` |
| 닉네임 중복 | 409 | `MEMBER4092` |
| 같은 영화에 평점 중복 | 409 | `RATING4091` |
| DB UNIQUE 제약 위반 | 409 | `COMMON4091` |
| 남의 평점 수정·삭제 | 403 | `COMMON403` |
| 없는 유저 / 없는 평점 | 404 | `COMMON404` |

## 검증 규칙

- email — 이메일 형식, 비어 있지 않음
- nickname — 2~12자
- password — 대문자·소문자·숫자·특수문자 포함 8자 이상
- score — 1~5 정수, 필수
- comment — 500자 이하, 선택
- movieId — 양의 정수 (TMDB가 부여한 값, 우리 DB의 FK가 아님)

## 비밀번호

`spring-security-crypto`의 `BCryptPasswordEncoder`로 해시해 저장하고, 응답 DTO(`MemberResponse`)에는
아예 필드를 두지 않아 평문·해시 모두 밖으로 나가지 않아요.

> `spring-boot-starter-security`를 넣으면 시큐리티 자동 설정이 켜지면서 모든 API가 로그인 페이지로
> 막히기 때문에, 해시 기능만 있는 가벼운 쪽을 썼어요.

## 저장 실패를 막는 세 겹

```
폼 입력 → DTO 검증(형식/범위) → 서비스 검증(존재/소유/중복) → DB 제약(UNIQUE/FK)
```

서비스에서 중복을 미리 걸러도, 거의 동시에 같은 이메일로 요청이 들어오면 둘 다 통과할 수 있어요.
그래서 DB의 UNIQUE 제약을 마지막 안전망으로 두고, 거기서 터진 예외도
`GlobalExceptionHandler`가 같은 형식의 409로 바꿔 줍니다.

## 패키지

```
com.umc.study
├── config      PasswordConfig(bcrypt), WebConfig(CORS)
├── controller  MemberController, RatingController (+ 3·4주차 Book/Rental)
├── service     MemberService, RatingService
├── repository  MemberRepository, RatingRepository
├── domain      BaseTimeEntity, Member, Rating
├── dto         ApiResponse, SignUpRequest, MemberResponse, CreateRatingRequest, UpdateRatingRequest …
└── exception   DuplicateException, GlobalExceptionHandler
```
