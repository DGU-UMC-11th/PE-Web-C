# week8/be — 즐겨찾기와 트랜잭션

Spring Boot 3.5 / Java 21 / MySQL 8 / JPA / JWT

7주차에서 "요청자가 누구인지"를 토큰으로 알게 됐으니,
이번 주에는 **로그인한 회원의 데이터**인 즐겨찾기를 만들고,
한 요청이 두 테이블을 바꿀 때를 **트랜잭션**으로 묶었어요.

## 실행

```bash
mysql -u root -p <DB이름> < sql/03_favorite_schema.sql   # 8주차: favorite 테이블
```

환경 변수는 7주차와 같아요. (`DB_URL` / `DB_USER` / `DB_PW` / `JWT_SECRET` / `JWT_ACCESS_EXPIRATION`)

## 이번 주 API

요청 어디에도 `memberId`가 없어요. 전부 `Authorization: Bearer {token}` 으로 식별해요.

| API | Method | URL | 요청 | 성공 |
|---|---|---|---|---|
| 즐겨찾기 등록 | POST | `/favorites` | Body: `movieId` | 201 |
| 내 즐겨찾기 조회 | GET | `/favorites` | — | 200 |
| 즐겨찾기 여부 조회 | GET | `/favorites/{movieId}` | — | 200 |
| 즐겨찾기 해제 | DELETE | `/favorites/{movieId}` | — | 200 |
| 영화 기록 저장 | POST | `/movie-records` | Body: `movieId`, `score`, `comment`, `addToFavorites` | 201 |

- 해제도 공통 응답 형식을 유지하려고 **204 대신 200 + `result: null`** 을 써요.
- 즐겨찾기하지 않은 영화는 오류가 아니라 정상 상태라서 **200 + `isFavorite: false`** 예요.
- 빈 목록도 정상이라 **200 + `[]`** 예요.

## 추가된 실패 코드

| code | 상태 | 언제 |
|---|---|---|
| `FAVORITE404_1` | 404 | 해제하려는 즐겨찾기가 없음 |
| `FAVORITE409_1` | 409 | 이미 같은 영화를 즐겨찾기함 |

평점 중복은 7주차의 `RATING409_1`을 그대로 써요. 의미가 같은데 코드를 새로 만들 이유가 없어요.

## 즐겨찾기는 관계예요

영화의 속성이 아니라 **회원과 영화의 관계**라서, `Favorite`에는 `Member`와 `movieId`가 함께 들어가요.
`movie_id`는 TMDB가 준 숫자이고 우리 DB에는 `movie` 테이블이 없으니 외래 키가 아니에요.

```
favorite: UNIQUE (member_id, movie_id)
```

`movie_id`만 UNIQUE로 걸면 **한 영화를 서비스 전체에서 한 명만** 즐겨찾기할 수 있게 돼요. 반드시 두 값을 한 쌍으로 묶어야 해요.

## 트랜잭션

`POST /movie-records`는 `addToFavorites: true`일 때 평점과 즐겨찾기를 **같이** 저장해요.

```java
@Transactional
public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) { ... }
```

중요한 건 `RatingService.create()`와 `FavoriteService.create()`를 **연달아 부르지 않은 것**이에요.
각각 별도 트랜잭션으로 동작할 수 있어서, 평점만 저장되고 즐겨찾기는 실패한 상태가 남을 수 있거든요.
그래서 "영화 기록"이라는 하나의 사용자 행동을 처리하는 전용 서비스에서 두 저장을 한 묶음으로 처리해요.

- 메서드가 정상 종료 → **commit**
- 런타임 예외가 밖으로 나감 → **rollback**

트랜잭션은 오류를 없애주는 기능이 아니에요. 오류가 났을 때 **데이터가 어중간한 상태로 남지 않게** 해주는 기능이에요.

## 사전 검사와 DB 제약을 둘 다 두는 이유

```
서비스의 exists 검사 → 사용자에게 보여줄 명확한 메시지 (FAVORITE409_1)
DB의 UNIQUE 제약   → 동시 요청까지 막는 마지막 안전망
```

거의 동시에 같은 요청이 두 번 들어오면 둘 다 사전 검사를 통과할 수 있어요.
그때 데이터 자체를 지키는 건 DB 제약이고, 그 예외는 `GlobalExceptionHandler`가 같은 형식의 409로 바꿔줘요.

## 인터셉터는 손대지 않았어요

7주차 `WebConfig`가 "전부 잠그고 열 경로만 예외"로 되어 있어서
`/favorites`, `/movie-records`는 **자동으로 보호**돼요. 공개 예외 목록에 새 경로를 넣지 않은 것만 확인하면 됩니다.

## 프론트를 위해 바뀐 것 하나

`GET /members/me` 응답에 `memberId`를 추가했어요.
프론트가 공개 API인 `GET /members/{memberId}/ratings`를 부르려면 자기 번호를 알아야 하는데,
클라이언트가 토큰을 직접 해석하는 것보다 서버가 알려주는 편이 안전해요.
