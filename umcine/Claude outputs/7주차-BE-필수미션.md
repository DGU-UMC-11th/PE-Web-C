# ✅ 7주차 BE 필수 미션 - 로그인한 사용자를 구분하기 (Spring Boot)

## 📌 미션 요약
로그인 API로 JWT를 발급하고, 모든 요청의 토큰을 한곳(인터셉터)에서 검증해 요청자를 알아낸다. 6주차 평점 API에서 `memberId`를 걷어내고, 남의 평점은 403으로 막는다. 본문 실습 1~6을 완료하고 "9. Postman으로 전체 시나리오를 검증합시다"의 9단계를 순서대로 실행했다.

## 🗂️ 인증 요소 체크
| 제출물 / 확인 포인트 | 상태 |
| --- | --- |
| 로그인 성공 응답 (accessToken이 보이도록) | ✅ 1-1 |
| 토큰 없이 `GET /members/me` 호출 시 401 | ✅ 2-2 (`AUTH401_2`) |
| 다른 회원의 토큰으로 평점 수정 시도 시 403 | ✅ 4-5 (`RATING403_1`) |
| 본인 토큰으로 평점 등록 성공 201 | ✅ 4-1 |
| 평점 등록 요청 바디에 memberId가 **없음** | ✅ `{"movieId":27205,"score":4,"comment":"…"}` |
| 401과 403의 code가 서로 다름 | ✅ `AUTH401_2` ↔ `RATING403_1` |

아래 응답은 PC에서 실제 서버(`localhost:8080`, MySQL `umc_movie`)에 Postman과 같은 HTTP 요청 28개를 보내 받은 결과다(`api-test-w7.ps1`, 2026-11-14 14:21 실행, 전문은 `api-test-w7-result.md`).

---

## 📑 API 명세

### 새로 만든 API (모두 성공 시 200)
| Method | URL | 요청 | 성공 응답 `result` |
| --- | --- | --- | --- |
| POST | `/auth/login` | Body `{ email, password }` | `{ nickname, accessToken }` |
| GET | `/members/me` | Header `Authorization: Bearer {token}` | `{ email, nickname, createdAt }` |
| PATCH | `/members/me` | Header + Body `{ nickname }` | 조회와 동일 |

### 6주차 API를 토큰 기반으로 고친 것
| API | 6주차 | 7주차 | 바뀐 점 |
| --- | --- | --- | --- |
| 평점 등록 | `POST /members/{memberId}/ratings` → 201, `result: ratingId` | `POST /ratings` → 201, `result: RatingResponse` | URL에서 memberId 제거, 응답을 수정과 통일 |
| 평점 수정 | `PATCH /members/{memberId}/ratings/{ratingId}` | `PATCH /ratings/{ratingId}` | URL에서 memberId 제거 |
| 평점 삭제 | `DELETE /members/{memberId}/ratings/{ratingId}` → 204 | `DELETE /ratings/{ratingId}` → **200** + `result: null` | 204는 본문을 못 실어 공통 형식에서 빠지므로 200으로 |
| 유저별 평점 조회 | `GET /members/{memberId}/ratings` | 그대로 (공개) | 로그인 없이 누구나 |

세 쓰기 API는 `Authorization: Bearer {token}` 헤더가 필요하고, 요청 어디에도 "내가 누구인지" 적는 칸이 없다. **memberId는 토큰이 알려준다.**

### 실패 응답 code (`{도메인}{상태}_{일련번호}`)
| 상황 | code | 상태 | message |
| --- | --- | --- | --- |
| 로그인 정보가 틀림 (이메일 없음 / 비밀번호 틀림 **공통**) | `AUTH401_1` | 401 | 이메일 또는 비밀번호가 올바르지 않습니다. |
| 토큰이 아예 없음 (Bearer 형식 아님 포함) | `AUTH401_2` | 401 | 로그인이 필요한 요청입니다. |
| 토큰이 위조됨·형식 오류 | `AUTH401_3` | 401 | 유효하지 않은 토큰입니다. |
| 토큰이 만료됨 | `AUTH401_4` | 401 | 토큰이 만료되었습니다. 다시 로그인해주세요. |
| 회원을 찾을 수 없음 | `MEMBER404_1` | 404 | 해당 회원을 찾을 수 없습니다. |
| 닉네임이 이미 쓰이는 중 (나 제외) | `MEMBER409_1` | 409 | 이미 사용 중인 닉네임입니다. |
| 평점을 찾을 수 없음 | `RATING404_1` | 404 | 해당 평점을 찾을 수 없습니다. |
| 남의 평점을 건드림 | `RATING403_1` | 403 | 본인이 작성한 평점만 수정하거나 삭제할 수 있습니다. |
| 같은 영화에 평점을 또 남김 | `RATING409_1` | 409 | 이미 이 영화에 평점을 남기셨습니다. |

6주차 회원가입의 `MEMBER4091`(이메일 중복)/`MEMBER4092`(닉네임 중복)와 DTO 검증 `COMMON4001`은 그대로 둔다.

---

## 📁 추가·변경한 파일
| 파일 | 변경 |
| --- | --- |
| `build.gradle` | `jjwt-api`, `jjwt-impl`, `jjwt-jackson` 0.12.6 |
| `application.yml` | `jwt.secret`, `jwt.access-expiration` (`.env`에서 읽음) |
| `.env`, `.env.example` | `JWT_SECRET`(32자 이상), `JWT_ACCESS_EXPIRATION=3600` — `.env`는 Git 제외 |
| `util/JwtUtil.java` | **새 파일**. 토큰 생성·검증 |
| `dto/LoginRequest.java`, `LoginResponse.java` | **새 파일** |
| `dto/MemberInfoResponse.java`, `MemberUpdateRequest.java` | **새 파일** |
| `service/AuthService.java`, `controller/AuthController.java` | **새 파일**. 로그인 |
| `interceptor/AuthInterceptor.java` | **새 파일**. 토큰 검사 관문 |
| `config/WebConfig.java` | 인터셉터 등록, CORS에 `OPTIONS` 추가 |
| `entity/Member.java` | `updateNickname()` |
| `repository/MemberRepository.java` | `findByEmail`, `existsByNicknameAndMemberIdNot` |
| `service/MemberService.java` | `getMyInfo`, `updateMyInfo` |
| `controller/MemberController.java` | `GET/PATCH /members/me` |
| `service/RatingService.java` | 예외 code를 7주차 규칙으로, `create`가 `RatingResponse` 반환, 인자 순서 `(memberId, ratingId)` |
| `controller/RatingController.java` | 클래스 매핑 제거, `/ratings` 경로, `@RequestAttribute`로 memberId |
| `api-test-w7.ps1` | **새 파일**. 28개 요청 자동 점검 |

`ApiException`과 `@ExceptionHandler(ApiException.class)`는 6주차 선택 미션에서 이미 만들어 둬서 그대로 썼다.

---

## 🧾 핵심 코드

### 1. 흐름
```
[로그인]  POST /auth/login ──▶ AuthService: 이메일로 회원 찾기 → passwordEncoder.matches() → JwtUtil.createAccessToken()
                               ◀── { nickname, accessToken }

[이후 요청]  Authorization: Bearer {token}
   ──▶ AuthInterceptor.preHandle: 헤더 확인 → JwtUtil.getMemberId(서명·만료 검증) → request.setAttribute("memberId")
   ──▶ Controller: @RequestAttribute Long memberId
   ──▶ Service: 평점 주인 == memberId ? (인가)  → 아니면 403
```
**인증은 공통 관문(인터셉터)에서, 인가는 서비스에서.** 관문은 "당신이 누구인지"까지만 확인하고, "이 평점이 당신 것인지"는 DB를 봐야 아는 그 기능만의 규칙이라 서비스가 확인한다.

### 2. JwtUtil (`util/JwtUtil.java`)
```java
@Component
public class JwtUtil {
    private final SecretKey secretKey;
    private final Duration accessExpiration;

    public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.access-expiration}") Long accessExpiration) {
        // 문자열 비밀키를 HMAC-SHA 서명용 키 객체로. 32바이트 이상이면 HS256, 48바이트 이상이면 HS384가 골라져요.
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = Duration.ofSeconds(accessExpiration);
    }

    public String createAccessToken(Long memberId, String email) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(memberId))   // 토큰의 주인
                .claim("email", email)               // 참고용. 비밀번호 같은 민감 정보는 절대 넣지 않아요
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessExpiration)))
                .signWith(secretKey)                 // 이 서명 덕분에 내용을 조작하면 검증에서 걸려요
                .compact();
    }

    /** 검증을 통과하면 memberId를, 아니면 ApiException을 */
    public Long getMemberId(String token) {
        try {
            return Long.valueOf(getClaims(token).getPayload().getSubject());
        } catch (ExpiredJwtException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_4", "토큰이 만료되었습니다. 다시 로그인해주세요.");
        } catch (JwtException | IllegalArgumentException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_3", "유효하지 않은 토큰입니다.");
        }
    }

    private Jws<Claims> getClaims(String token) {
        return Jwts.parser().verifyWith(secretKey).clockSkewSeconds(60).build().parseSignedClaims(token);
    }
}
```

### 3. 로그인 (`service/AuthService.java`)
```java
@Transactional(readOnly = true)
public LoginResponse login(LoginRequest request) {
    // 1. 이메일로 회원을 찾아요. 없어도 "가입되지 않은 이메일"이라고 알려주지 않아요.
    //    (어떤 이메일이 가입돼 있는지 알아내는 데 쓰일 수 있어서, 두 경우 모두 AUTH401_1)
    Member member = memberRepository.findByEmail(request.email()).orElseThrow(() -> invalidCredentials());

    // 2. 입력한 비밀번호를 저장된 해시와 비교. matches()가 해시에서 salt를 꺼내 같은 방식으로 해시한 뒤 대조해요.
    if (!passwordEncoder.matches(request.password(), member.getPassword())) {
        throw invalidCredentials();
    }

    // 3. 토큰 발급
    String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
    return new LoginResponse(member.getNickname(), accessToken);
}
```
```java
// controller/AuthController.java
@PostMapping("/login")
public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody @Valid LoginRequest request) {
    return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", authService.login(request)));
}
```

### 4. 관문 (`interceptor/AuthInterceptor.java`, `config/WebConfig.java`)
```java
@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {
    public static final String MEMBER_ID = "memberId";
    private static final String BEARER_PREFIX = "Bearer ";
    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // CORS preflight(OPTIONS)에는 토큰이 붙지 않아요. 막으면 브라우저 요청이 전부 실패해요.
        if (HttpMethod.OPTIONS.matches(request.getMethod())) return true;

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2", "로그인이 필요한 요청입니다.");
        }
        Long memberId = jwtUtil.getMemberId(header.substring(BEARER_PREFIX.length())); // 실패하면 AUTH401_3 / _4
        request.setAttribute(MEMBER_ID, memberId);  // 컨트롤러가 @RequestAttribute로 꺼내 써요
        return true;
    }
}
```
```java
// WebConfig: "전부 잠그고 열 경로만 나열" — 새 API를 만들 때 깜빡해도 잠긴 채로 남아요
@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(authInterceptor)
            .addPathPatterns("/**")
            .excludePathPatterns(
                    "/auth/**",              // 로그인
                    "/members",              // 회원가입
                    "/members/nickname/**",  // 닉네임 중복 체크
                    "/members/email/**",     // 이메일 중복 체크
                    "/members/*/ratings",    // 유저별 평점 조회 (공개)
                    "/error");
}
```

### 5. 내 정보 조회·수정 (`MemberService`, `MemberController`)
```java
@GetMapping("/me")
public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(@RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId) {
    return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", memberService.getMyInfo(memberId)));
}

@PatchMapping("/me")
public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
        @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, @RequestBody @Valid MemberUpdateRequest request) {
    return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", memberService.updateMyInfo(memberId, request)));
}
```
```java
@Transactional
public MemberInfoResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
    Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다."));
    // "나 자신이 쓰고 있는 닉네임"은 중복이 아니에요. 나를 뺀 다른 회원이 쓰고 있을 때만 막아요.
    if (memberRepository.existsByNicknameAndMemberIdNot(request.nickname(), memberId)) {
        throw new ApiException(HttpStatus.CONFLICT, "MEMBER409_1", "이미 사용 중인 닉네임입니다.");
    }
    member.updateNickname(request.nickname()); // dirty checking → 커밋 시 UPDATE
    return MemberInfoResponse.from(member);
}
```

### 6. 평점 CRUD 리팩토링 (`RatingController`, `RatingService`)
```java
@RestController   // 클래스 레벨 @RequestMapping("/members/{memberId}/ratings")를 뺐어요
@RequiredArgsConstructor
public class RatingController {
    @GetMapping("/members/{memberId}/ratings")   // 5주차 공개 조회는 전체 경로로
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) { … }

    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, @RequestBody @Valid CreateRatingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.created("평점을 등록했습니다.", ratingService.create(memberId, request)));
    }

    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, @PathVariable Long ratingId, @RequestBody @Valid UpdateRatingRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", ratingService.update(memberId, ratingId, request)));
    }

    @DeleteMapping("/ratings/{ratingId}")   // 204 → 200 + result null
    public ResponseEntity<ApiResponse<Void>> delete(@RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
```
```java
// RatingService: 먼저 찾고(없으면 404), 찾았으면 주인을 봐요(내 것이 아니면 403)
private Rating findOwnedRating(Long memberId, Long ratingId) {
    Rating rating = ratingRepository.findById(ratingId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "RATING404_1", "해당 평점을 찾을 수 없습니다."));
    if (!rating.getMember().getMemberId().equals(memberId)) {   // 존재하지만 내 것이 아님 = 인가 실패
        throw new ApiException(HttpStatus.FORBIDDEN, "RATING403_1", "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.");
    }
    return rating;
}
```

---

## 📮 Postman 전체 시나리오 (9단계) 실행 결과

### 준비: 회원 A, B 가입 (6주차 API)
`POST /members` × 2 → 201. A = `a142135@umc.com`(memberId 15), B = `b142135@umc.com`(memberId 16)

### ① 로그인: A와 B의 토큰 받기
**1-1. A 로그인 → 200**
```json
// POST /auth/login  {"email":"a142135@umc.com","password":"Umc!1234"}
{"isSuccess":true,"code":"COMMON200","message":"로그인에 성공했습니다.","result":{"nickname":"에이142135","accessToken":"eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIxNSIsImVtYWlsIjoiYTE0MjEzNUB1bWMuY29tIiwiaWF0IjoxNzk0NjMzNjk2LCJleHAiOjE3OTQ2MzcyOTZ9.TZp2ieJwTjzxYI1ICWOh2knagPYiTykv-ca8MMnaB3FYrjs3MSHUQx9ZwjFbjt5n"}}
```
토큰을 점(`.`) 기준으로 나눠 Base64URL 디코딩하면 **비밀키 없이도** 내용이 읽힌다(jwt.io에 붙여 넣은 것과 같다).
```json
// header
{"alg":"HS384"}
// payload
{"sub":"15","email":"a142135@umc.com","iat":1794633696,"exp":1794637296}
```
- `alg`가 HS384인 이유: 비밀키가 48바이트를 넘어서 jjwt가 자동으로 HS384를 골랐다.
- `exp - iat = 3600`초. `JWT_ACCESS_EXPIRATION=3600`이 그대로 들어갔다.
- payload는 **인코딩**일 뿐 암호화가 아니다. 그래서 비밀번호 같은 값은 넣지 않는다.

**1-3. 비밀번호 틀림 → 401** / **1-4. 존재하지 않는 이메일 → 401 (같은 응답)**
```json
{"isSuccess":false,"code":"AUTH401_1","message":"이메일 또는 비밀번호가 올바르지 않습니다.","result":null}
{"isSuccess":false,"code":"AUTH401_1","message":"이메일 또는 비밀번호가 올바르지 않습니다.","result":null}
```
두 응답이 완전히 같다. "이메일이 없음"과 "비밀번호가 틀림"을 나누면 공격자가 가입된 이메일 목록을 알아낼 수 있어서다.

### 관문 확인: `GET /members/me`
| 요청 | 상태 | code |
| --- | --- | --- |
| 2-1. 토큰 A | 200 | `COMMON200` → `{"email":"a142135@umc.com","nickname":"에이142135","createdAt":"2026-11-14T14:21:36"}` |
| 2-2. **토큰 없이** | **401** | `AUTH401_2` 로그인이 필요한 요청입니다. |
| 2-3. `Bearer ` 접두사 없이 토큰만 | 401 | `AUTH401_2` |
| 2-4. **payload 한 글자를 바꾼 토큰** | **401** | `AUTH401_3` 유효하지 않은 토큰입니다. |
| 2-5. `this.is.not-a-jwt` | 401 | `AUTH401_3` |

2-4가 서명의 역할이다. payload의 글자 하나만 바뀌어도 서버가 비밀키로 다시 계산한 서명과 맞지 않아 거절된다.

### 내 정보 수정: `PATCH /members/me`
| 요청 | 상태 | 결과 |
| --- | --- | --- |
| 3-1. `{"nickname":"에이수정142135"}` | 200 | `result.nickname` = 에이수정142135 |
| 3-2. 변경 후 조회 | 200 | 바뀐 닉네임 확인 |
| 3-3. 내 닉네임 그대로 다시 저장 | 200 | **나 자신은 중복으로 보지 않음** (`existsByNicknameAndMemberIdNot`) |
| 3-4. B의 닉네임으로 변경 | 409 | `MEMBER409_1` 이미 사용 중인 닉네임입니다. |
| 3-5. 닉네임 1자 | 400 | `COMMON4001` 닉네임은 2자 이상 12자 이하여야 합니다. |

### ③ 등록: 토큰 A로 `POST /ratings` → 201
```json
// 요청 바디 — memberId가 없다
{"movieId":27205,"score":4,"comment":"꿈 속의 꿈"}
// 응답
{"isSuccess":true,"code":"COMMON201","message":"평점을 등록했습니다.","result":{"ratingId":6,"movieId":27205,"score":4,"comment":"꿈 속의 꿈","createdAt":"2026-11-14T14:21:36.984829","updatedAt":"2026-11-14T14:21:36.984829"}}
```

### ④ 중복 등록 → 409
```json
{"isSuccess":false,"code":"RATING409_1","message":"이미 이 영화에 평점을 남기셨습니다.","result":null}
```

### ⑤ 본인 수정: 토큰 A로 `PATCH /ratings/6` → 200
```json
{"isSuccess":true,"code":"COMMON200","message":"평점을 수정했습니다.","result":{"ratingId":6,"movieId":27205,"score":5,"comment":"다시 봐도 명작","createdAt":"2026-11-14T14:21:37","updatedAt":"2026-11-14T14:21:37"}}
```

### ⑥ 남의 것 수정: **토큰만 B로 바꿔서** 같은 요청 → 403
```json
{"isSuccess":false,"code":"RATING403_1","message":"본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.","result":null}
```
토큰 B는 멀쩡하다(인증 통과). 그런데도 막혔다(인가 실패). 이게 인증과 인가가 다른 일이라는 증거다.

### ⑦ 토큰 없이 같은 요청 → 401
```json
{"isSuccess":false,"code":"AUTH401_2","message":"로그인이 필요한 요청입니다.","result":null}
```
⑥과 ⑦ 비교: 둘 다 거절이지만 code가 `RATING403_1` ↔ `AUTH401_2`로 다르다. 프론트는 401이면 로그인 화면으로, 403이면 "권한이 없습니다" 안내로 분기할 수 있다.

### ⑧ 없는 평점: 토큰 A로 `DELETE /ratings/99999` → 404
```json
{"isSuccess":false,"code":"RATING404_1","message":"해당 평점을 찾을 수 없습니다.","result":null}
```
B가 A의 평점(6번)을 지우려 한 4-8도 403 `RATING403_1`이었다.

### ⑨ 본인 삭제: 토큰 A로 `DELETE /ratings/6` → 200
```json
{"isSuccess":true,"code":"COMMON200","message":"평점을 삭제했습니다.","result":null}
```
삭제 전 공개 조회 `GET /members/15/ratings`(토큰 없이) → 평점 1건, 삭제 후 → `[]`.

### 세 가지 거절 비교
| 왜 | 결과 | 만든 방법 | code |
| --- | --- | --- | --- |
| 서버가 요청자를 특정할 수 없음 | **401** | Authorization 헤더를 빼고 요청 | `AUTH401_2` |
| 요청자는 알지만 그 데이터가 남의 것 | **403** | 다른 회원의 토큰으로 남의 평점 수정 | `RATING403_1` |
| 대상 자체가 없음 | **404** | 없는 ratingId로 삭제 | `RATING404_1` |

---

## ✅ 실습 체크리스트
- [x] `ApiException`을 던졌을 때 전역 처리기가 우리가 정한 code와 상태 코드로 응답한다 (모든 실패 응답이 `{ isSuccess:false, code, message, result:null }`)
- [x] `POST /auth/login`으로 토큰을 발급받고 payload 내용을 직접 확인했다 (`sub`, `email`, `iat`, `exp`)
- [x] 존재하지 않는 이메일과 틀린 비밀번호가 **같은 응답**을 돌려주는 것을 확인했고, 이유(가입 여부 노출 방지)를 설명할 수 있다
- [x] 인터셉터를 등록해 토큰 없이 `GET /members/me` → 401
- [x] payload 한 글자를 바꾼 토큰 → 서명 검증 실패 401 `AUTH401_3`
- [x] 평점 등록/수정/삭제에서 memberId를 받는 코드를 전부 제거했다 (URL·바디 모두)
- [x] 회원 두 명으로 남의 평점 수정을 시도해 403을 받았고 401과의 차이를 설명할 수 있다

## 📸 캡처
실행 결과 전문은 `api-test-w7-result.md`에 있다. Postman으로 같은 요청을 보내 캡처할 때는 `api-test-w7.ps1 -KeepRunning`으로 서버를 켜 두고 아래 네 장을 찍는다.
1. `POST /auth/login` 200 (accessToken 보이게)
2. `GET /members/me` 토큰 없이 → 401 `AUTH401_2`
3. `PATCH /ratings/{id}` B 토큰 → 403 `RATING403_1`
4. `POST /ratings` A 토큰 → 201

📸 *(Postman 캡처 자리)*

---

## 🧯 트러블 슈팅

### 이슈 No.1 - `alg`가 HS256이 아니라 HS384로 찍힘
**이슈**
워크북 그림에는 `{"alg":"HS256"}`인데, 발급받은 토큰의 header를 디코딩하니 `{"alg":"HS384"}`였다.

**문제**
jjwt의 `Keys.hmacShaKeyFor()`는 비밀키 길이에 맞춰 알고리즘을 고른다. 32바이트 이상이면 HS256, 48바이트 이상이면 HS384. `JWT_SECRET`으로 넣은 예시 키가 48자를 넘어서 HS384가 선택됐다.

**해결**
동작에는 문제가 없어서 그대로 뒀다. 검증도 같은 키로 하므로 알고리즘이 바뀌어도 맞춰 들어간다. HS256으로 고정하고 싶으면 `.signWith(secretKey, Jwts.SIG.HS256)`처럼 명시하면 된다.

**참고 레퍼런스**
- jjwt README의 "Signature Algorithms" — 키 길이에 따른 자동 선택

### 이슈 No.2 - 인터셉터 예외 경로를 어디까지 열어야 하나
**이슈**
`/members`를 열어 두면 회원가입(POST)뿐 아니라 같은 경로의 다른 메서드도 열린다. `/members/*/ratings`를 열어 두면 5주차 공개 조회(GET)가 열리는데, 6주차의 `POST /members/{id}/ratings`가 남아 있었다면 그것도 열렸을 것이다.

**문제**
`HandlerInterceptor`의 경로 패턴은 HTTP 메서드를 구분하지 못한다.

**해결**
7주차에서 쓰기 API를 `/ratings`로 옮겨서 `/members/*/ratings`에는 GET만 남게 했다. `/members`에도 지금은 POST(회원가입)만 있다. 메서드까지 구분해야 할 때는 `preHandle` 안에서 `request.getMethod()`로 분기한다는 것을 기억해 둔다. "전부 잠그고 열 경로만 나열"하는 방식이라, 나중에 `/members`에 GET을 추가하면 그것도 열린다는 점을 주석으로 남겼다.

### 이슈 No.3 - 403과 404의 순서
**이슈**
`findOwnedRating`에서 주인 검사를 먼저 하면, 존재하지도 않는 평점에 "권한이 없습니다"라고 답하게 된다.

**해결**
먼저 `findById`(없으면 404), 찾았으면 주인 비교(아니면 403) 순서로 뒀다. 4-7(없는 평점 → 404)과 4-8(남의 평점 → 403)에서 확인했다. 서비스에 따라서는 남의 것에도 404를 줘서 존재 여부를 숨기기도 하는데, 이번에는 401·403·404의 차이를 눈으로 보는 게 목적이라 403을 그대로 썼다.

---

## ▶️ 실행 방법
```powershell
# MySQL 실행 중, .env에 DB_USERNAME/DB_PASSWORD/JWT_SECRET/JWT_ACCESS_EXPIRATION
cd C:\Users\82102\Desktop\study\movie
powershell -ExecutionPolicy Bypass -File .\api-test-w7.ps1               # 빌드 → 서버 → 28개 요청 → api-test-w7-result.md
powershell -ExecutionPolicy Bypass -File .\api-test-w7.ps1 -KeepRunning  # 서버를 켜 둠 (Postman 캡처용)
```

## 💡 배운 점
- 인증(너 누구야? → 401)과 인가(너 이거 해도 돼? → 403)는 다른 일이고, 확인하는 자리도 다르다. 인증은 관문 한 곳, 인가는 그 데이터를 아는 서비스.
- URL이나 바디에서 `memberId`를 받지 않는 것 자체가 보안이다. 받지 않으면 조작할 수 없다.
- JWT의 payload는 누구나 읽는다. 서명이 지키는 것은 "못 바꾼다"이지 "못 본다"가 아니다. 그래서 비밀키는 `.env`에만 두고 Git에 올리지 않는다.
- 로그인 실패 이유를 친절하게 나누지 않는 것이 더 안전한 경우가 있다.
