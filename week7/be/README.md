# week7/be — 로그인한 사용자를 구분하는 백엔드

Spring Boot 3.5 / Java 21 / MySQL 8 / JPA / **JWT(jjwt 0.12.6)**

6주차까지는 요청이 `memberId`를 직접 알려줬어요. 이번 주차부터는 **토큰이 알려줍니다.**

## 실행

```bash
mysql -u root -p <DB이름> < sql/01_movie_schema.sql
mysql -u root -p <DB이름> < sql/02_movie_seed.sql
```

환경 변수 (6주차 것 + JWT 2개):

```txt
DB_URL / DB_USER / DB_PW
JWT_SECRET=umc-11th-movie-rating-secret-key-please-change-me   # 최소 32자
JWT_ACCESS_EXPIRATION=3600                                      # 초 단위 (1시간)
```

> `JWT_SECRET`은 **절대 깃허브에 올리면 안 돼요.** 비밀키를 아는 사람은 토큰을 원하는 내용으로 위조할 수 있어요.

## 새로 만든 API

| API | Method | URL | 헤더 |
|---|---|---|---|
| 로그인 | POST | `/auth/login` | — |
| 내 정보 조회 | GET | `/members/me` | `Authorization: Bearer {token}` |
| 내 정보 수정 | PATCH | `/members/me` | `Authorization: Bearer {token}` |

## 토큰 기반으로 바꾼 API

| 6주차 | 7주차 |
|---|---|
| `POST /members/{memberId}/ratings` | `POST /ratings` |
| `PATCH /members/{memberId}/ratings/{ratingId}` | `PATCH /ratings/{ratingId}` |
| `DELETE /members/{memberId}/ratings/{ratingId}` | `DELETE /ratings/{ratingId}` |

URL에서 `memberId`가 사라진 건 보기 좋아서가 아니에요.
**URL에 남아 있으면 클라이언트가 그 값을 바꿔 보낼 수 있기 때문**이에요. 값을 받지 않는 것이 곧 조작당하지 않는 방법입니다.

삭제는 6주차의 **204 → 200**으로 바꿨어요. 204는 "본문 없음"이라 공통 응답 형식을 실을 수 없어서,
형식을 맞추려고 200 + `result: null`로 통일했어요.

`GET /members/{memberId}/ratings`(유저별 평점 조회)는 **공개 기능이라 그대로** 둡니다.

## 실패 코드

| 상황 | status | code |
|---|---|---|
| 로그인 정보가 틀림 | 401 | `AUTH401_1` |
| 토큰이 아예 없음 | 401 | `AUTH401_2` |
| 토큰이 위조됨 | 401 | `AUTH401_3` |
| 토큰이 만료됨 | 401 | `AUTH401_4` |
| 회원을 찾을 수 없음 | 404 | `MEMBER404_1` |
| 닉네임이 이미 쓰이는 중 | 409 | `MEMBER409_1` |
| 평점을 찾을 수 없음 | 404 | `RATING404_1` |
| 남의 평점을 건드림 | 403 | `RATING403_1` |
| 같은 영화에 평점을 또 남김 | 409 | `RATING409_1` |

`{도메인}{상태코드}_{일련번호}` 규칙이라 프론트가 `AUTH401_4`만 보고도
"인증 쪽 401이고 그중 네 번째 사유"라는 걸 알 수 있어요.

## 401과 403

- **401 Unauthorized** — 네가 누군지 모르겠어. (토큰이 없거나 위조·만료)
- **403 Forbidden** — 네가 누군지는 알겠는데 그건 네 것이 아니야.

이름 때문에 401이 "인가 실패"처럼 보이지만, 401이 **인증** 실패이고 403이 **인가** 실패예요.

## 구조

```
com.umc.study
├── util/JwtUtil                  토큰 생성·검증 (만료는 AUTH401_4로 따로 구분)
├── interceptor/AuthInterceptor   모든 요청이 지나는 관문. 토큰 → memberId를 request에 담음
├── annotation/LoginMember        (선택 미션) 컨트롤러 파라미터용 어노테이션
├── resolver/LoginMemberArgumentResolver  @LoginMember에 memberId를 넣어줌
├── config/WebConfig              CORS + 인터셉터 등록 + ArgumentResolver 등록
├── exception/ApiException        status + code + message를 들고 다니는 예외
└── service/RatingService         findOwnedRating: 404 → 403 순서로 소유권 검사
```

**인증은 공통 관문에서, 인가는 서비스에서.**
관문은 "당신이 누구인지"까지만 확인해줘요. "이 평점이 당신 것인지"는 DB를 봐야 아는
그 기능만의 규칙이라 서비스가 처리합니다.

## 인터셉터 등록 방식

잠글 경로를 나열하는 대신 **전부 잠그고 열 경로만 나열**했어요.

```java
.addPathPatterns("/**")
.excludePathPatterns("/auth/**", "/members", "/members/nickname/**",
                     "/members/email/**", "/members/*/ratings",
                     "/books/**", "/rentals/**", "/error");
```

전자는 새 API를 만들며 목록 추가를 깜빡하면 그 API가 무방비로 열리지만,
후자는 깜빡해도 잠긴 채로 남아요. 실수했을 때 안전한 쪽으로 기울어지는 설계예요.

## 선택 미션 — @LoginMember

컨트롤러마다 `@RequestAttribute("memberId")`를 반복하지 않도록 어노테이션으로 묶었어요.

```java
// before
public ... getMyInfo(@RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId)

// after
public ... getMyInfo(@LoginMember Long memberId)
```

컨트롤러에서 `"memberId"` 문자열을 직접 쓰는 곳이 사라지고,
이름만 봐도 "이 값은 로그인한 사용자에게서 온다"는 게 드러나요.
