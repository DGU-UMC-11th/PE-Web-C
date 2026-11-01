# 📚 4주차 개념 정리 - ORM, Entity, Repository, DTO

## 📌 이번 주차 한 줄 요약
3주차에 JdbcTemplate와 SQL 문자열로 만든 도서 API를, **테이블 ↔ 객체를 연결하는 ORM(JPA)** 으로 리팩터링한다. 테이블은 그대로 두고(`ddl-auto: validate`), 코드는 Entity · Repository · DTO로 역할을 나눈다.

---

## 1. ORM은 무엇을 대신해 주나

**ORM(Object-Relational Mapping)** 은 객체와 관계형 DB 테이블을 연결해 주는 도구다. `Book` 클래스와 `book` 테이블의 관계를 한 번 정의해 두면, 조회·저장 같은 반복 작업을 Repository 메서드로 표현할 수 있다.

| 구성 요소 | 역할 | 이번 주차 코드 |
| --- | --- | --- |
| **Entity** | 테이블 한 개 = 클래스 하나. 행 하나 = 객체 하나 | `Book`, `Category` |
| **Repository** | 엔티티를 조회·저장하는 DB 전담 창구 | `BookRepository`, `CategoryRepository` |
| **DTO** | API로 들어오고 나가는 데이터의 약속 | `CreateBookRequest`, `BookResponse` |

> ORM이 SQL을 없애는 것은 아니다. 내부에서는 여전히 SQL이 실행된다. 반복 CRUD 코드를 줄여 줄 뿐, 복잡한 조회나 성능 문제를 풀 때는 SQL과 실행 계획을 알아야 한다.

### Raw SQL(3주차) vs ORM(4주차)

| 구분 | 3주차 JdbcTemplate | 4주차 JPA |
| --- | --- | --- |
| 조회 코드 | `jdbcTemplate.queryForList("SELECT * FROM book")` | `bookRepository.findAllByOrderByBookIdDesc()` |
| 결과 타입 | `List<Map<String, Object>>` (키가 컬럼명 문자열) | `List<Book>` (필드가 타입을 가진 객체) |
| 저장 | `INSERT ... VALUES (?, ?, ?)` 문자열 + 파라미터 순서 관리 | `bookRepository.save(new Book(...))` |
| 관계 | `category_id` 숫자를 직접 다룸 | `book.getCategory().getName()`처럼 객체로 따라감 |
| 오타 발견 시점 | 실행해야 SQL 오류로 발견 | 필드·메서드 이름은 컴파일 시점에 발견 |
| 응답 모양 | DB 컬럼명이 그대로 응답 키 | DTO로 API 필드를 따로 정함 |

---

## 2. ERD 테이블을 엔티티로 옮기기

### 매핑 순서
1. ERD에서 테이블명, PK, FK, NULL 여부를 확인한다.
2. `book` 테이블 → `Book` 엔티티.
3. FK `category_id` → `Category`와의 **다대일(`@ManyToOne`)** 관계.
4. DB의 snake_case 컬럼명과 코드의 camelCase 필드명을 `@Column(name = ...)`으로 명시한다.

### 어노테이션 정리

| 어노테이션 | 의미 |
| --- | --- |
| `@Entity` | JPA가 관리하는 엔티티 클래스 |
| `@Table(name = "book")` | 연결할 테이블 이름 |
| `@Id` | PK |
| `@GeneratedValue(strategy = IDENTITY)` | PK 값을 DB의 `AUTO_INCREMENT`에 맡김 |
| `@Column(name = "is_available", nullable = false)` | 컬럼 이름·NOT NULL·길이 등 |
| `@ManyToOne(fetch = LAZY)` | 책 여러 권 → 카테고리 하나. LAZY는 카테고리를 실제로 쓸 때 가져옴 |
| `@JoinColumn(name = "category_id")` | 어떤 FK 컬럼으로 연결되는지 |
| `@NoArgsConstructor(access = PROTECTED)` | JPA가 객체를 만들 때 쓰는 기본 생성자. 외부에서 빈 객체를 만들지 못하게 막음 |

### `ddl-auto: validate`
- 3주차에 Workbench로 만든 테이블을 그대로 쓰므로, Hibernate가 테이블을 **만들거나 바꾸지 않고** 엔티티와 테이블 구조(테이블·컬럼 존재, 타입)가 맞는지만 검사한다.
- 안 맞으면 서버가 시작될 때 바로 실패하므로, 잘못된 매핑을 API 호출 전에 발견할 수 있다.
- `open-in-view: false`: DB 연결을 HTTP 요청 끝까지 붙잡지 않고 Service의 트랜잭션 안에서만 쓴다. 그래서 LAZY 데이터는 트랜잭션 안(Service)에서 DTO로 바꿔 둬야 한다.

---

## 3. Repository

```java
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findAllByOrderByBookIdDesc();
}
```
- `JpaRepository<엔티티, PK 타입>`을 상속하는 것만으로 `save`, `findById`, `findAll`, `delete` 등이 생긴다.
- **메서드 이름 규칙(쿼리 메서드)**: `findAllBy` + `OrderByBookIdDesc` → `SELECT ... ORDER BY book_id DESC`를 Spring Data JPA가 만든다.
- 구현 클래스를 직접 만들지 않는다. 실행 시 Spring이 프록시 구현체를 만들어 Bean으로 등록한다.

---

## 4. DTO로 API 약속 만들기

### 왜 Entity를 그대로 응답하지 않나
- **DB 구조가 API 계약이 된다.** 컬럼 이름을 바꾸면 API 응답도 바뀌어 클라이언트가 깨진다.
- **필요 없는 값까지 나간다.** 내부 관리용 컬럼, 연관 엔티티 전체가 노출될 수 있다.
- **LAZY 프록시 직렬화 오류.** 아직 로딩되지 않은 `category`를 JSON으로 바꾸다 오류가 나거나, 양방향 관계면 무한 순환이 생긴다.

### 요청 DTO 검증
```java
public record CreateBookRequest(
        @NotNull Long categoryId,
        @NotBlank @Size(max = 100) String title,
        String description
) {}
```
| 어노테이션 | 통과 조건 |
| --- | --- |
| `@NotNull` | `null`이 아님 (값 누락 금지) |
| `@NotBlank` | `null`, `""`, `"   "` 모두 실패 |
| `@Size(max = 100)` | 길이 100 이하 |

- Controller 파라미터에 `@Valid`를 붙여야 검증이 실제로 실행된다.
- 검증 실패는 `MethodArgumentNotValidException` → `@RestControllerAdvice`에서 400으로 바꾼다.

---

## 5. 요청 흐름 (GET / POST)

```
Client ──HTTP──▶ Controller ──▶ Service ──▶ Repository ──SQL──▶ MySQL
                 (@Valid 검증)   (@Transactional,   (JpaRepository)
                                  Entity ↔ DTO 변환)
```

- `GET /books`: Controller → Service가 Repository로 엔티티 목록 조회 → `BookResponse`로 변환해 반환
- `POST /books`: 요청 DTO 검증 → 카테고리 존재 확인 → `Book` 엔티티 생성·저장 → `201 Created`와 응답 DTO

### Spring Boot ↔ NestJS 대응

| 역할 | Spring Boot (JPA) | NestJS (TypeORM) |
| --- | --- | --- |
| 엔티티 | `@Entity`, `@Column`, `@ManyToOne` | `@Entity`, `@Column`, `@ManyToOne` |
| Repository | `interface ... extends JpaRepository` | `@InjectRepository(Book) Repository<Book>` |
| 관계 함께 조회 | `@EntityGraph`, fetch join | `find({ relations: { category: true } })` |
| 요청 검증 | `@Valid` + Bean Validation | 전역 `ValidationPipe` + class-validator |
| 스키마 자동 변경 끄기 | `ddl-auto: validate` / `none` | `synchronize: false` |
| 없는 리소스 | 직접 만든 예외 + `@RestControllerAdvice` | `NotFoundException` |

---

## 🎯 핵심 키워드

### 1. JPA / Hibernate / Spring Data JPA / TypeORM
| 이름 | 정체 | 비유 |
| --- | --- | --- |
| **JPA (Jakarta Persistence)** | 자바 ORM **표준 명세**. `@Entity`, `EntityManager` 같은 인터페이스와 규칙만 정의 | 설계도 |
| **Hibernate** | JPA 명세를 실제로 **구현한 라이브러리**. SQL 생성, 영속성 컨텍스트 관리 등 | 설계도대로 만든 엔진 |
| **Spring Data JPA** | JPA 위에 Repository 추상화를 얹은 Spring 모듈. 쿼리 메서드, `JpaRepository` 제공 | 엔진을 쉽게 쓰게 해 주는 운전석 |
| **TypeORM** | TypeScript/JavaScript용 ORM **라이브러리**. 명세와 구현이 나뉘어 있지 않고 라이브러리 자체가 API를 정의 | 엔진과 운전석을 한 회사가 같이 만든 차 |

→ 코드에서 쓰는 `jakarta.persistence.*` 어노테이션은 JPA, 실제로 SQL을 만드는 것은 Hibernate, `findAllByOrderByBookIdDesc()`를 해석하는 것은 Spring Data JPA다.

### 2. Entity Lifecycle과 Persistence Context
- **영속성 컨텍스트(Persistence Context)**: 트랜잭션 동안 엔티티를 보관·관리하는 1차 저장소. `EntityManager`가 관리한다.
- **엔티티 상태**

| 상태 | 설명 |
| --- | --- |
| 비영속 (new/transient) | `new Book(...)`만 하고 아직 JPA가 모름 |
| 영속 (managed) | `persist`/`save`나 조회로 영속성 컨텍스트가 관리 중 |
| 준영속 (detached) | 트랜잭션이 끝나 더 이상 관리되지 않음 |
| 삭제 (removed) | 삭제 예정으로 표시됨 |

- **저장할 때 SQL이 바로 실행되지 않을 수 있는 이유**: JPA는 변경 내용을 모아 두었다가(**쓰기 지연**) **flush** 시점(보통 트랜잭션 커밋 직전, 또는 JPQL 실행 직전)에 SQL을 한꺼번에 보낸다. 영속 엔티티의 필드를 바꾸면 커밋 때 스냅샷과 비교해 UPDATE를 만든다(**변경 감지, dirty checking**).
- **예외 - IDENTITY 전략**: `@GeneratedValue(strategy = IDENTITY)`는 PK를 DB가 INSERT할 때 정하므로, Hibernate는 PK를 알기 위해 `save()` 시점에 **INSERT를 즉시 실행**한다. 이번 `Book`이 이 경우라 저장 직후 응답에 `bookId`가 들어 있다.

### 3. DTO와 API Contract
- **API Contract**: 클라이언트와 서버가 약속한 요청·응답의 모양(필드명, 타입, 필수 여부, 상태 코드).
- Entity를 그대로 응답하면 DB 변경이 곧 API 변경이 되고, 민감한 컬럼 노출·LAZY 직렬화 오류·순환 참조가 생길 수 있다.
- DTO로 분리하면 DB는 DB대로, API는 API대로 바꿀 수 있다. 예: DB 컬럼 `category_id`/`category.name` → 응답 필드 `categoryName`.

### 4. Validation
- **Controller 단에서 검증하는 이유**: 잘못된 요청을 **가장 앞에서** 걸러 Service의 비즈니스 로직, 트랜잭션, DB 조회까지 가지 않게 한다(fail fast). 검증 규칙이 DTO에 선언되어 한눈에 보이고, 실패 응답(400)도 한곳에서 일정하게 만들 수 있다.
- 다만 "그 카테고리가 DB에 있는가"처럼 **DB를 봐야 아는 규칙**은 Service에서 확인한다(→ 404).

| 오류 종류 | 확인 위치 | 상태 코드 |
| --- | --- | --- |
| 빈 제목, 100자 초과, categoryId 누락 | Controller (`@Valid`) | 400 |
| JSON 형식 오류, categoryId에 문자 | Controller (메시지 변환 단계) | 400 |
| 없는 categoryId | Service (Repository 조회) | 404 |

### 5. N+1 Query
- 목록 1번 조회(1) 후, 각 엔티티의 LAZY 연관 데이터를 꺼낼 때마다 쿼리가 추가로(N) 나가는 문제.
- 이번 코드에서 `BookResponse.from(book)`이 `book.getCategory().getName()`을 부르면, 카테고리가 아직 로딩되지 않았을 때 `SELECT ... FROM category WHERE category_id = ?`가 추가로 실행된다. (같은 카테고리는 영속성 컨텍스트에 캐시되므로 정확히는 "서로 다른 카테고리 수"만큼)
- 해결 방법
  - `@EntityGraph(attributePaths = "category")` - 이번 코드에서 사용. 책과 카테고리를 JOIN 한 번으로 가져온다.
  - JPQL **fetch join**: `select b from Book b join fetch b.category`
  - `hibernate.default_batch_fetch_size`: 연관 데이터를 `IN (...)`으로 묶어서 가져온다.
- `EAGER`로 바꾸는 것은 해결책이 아니다. 필요 없을 때도 항상 가져오고, JPQL 조회에서는 여전히 N+1이 생길 수 있다.

### 6. Migration과 synchronize (ddl-auto)
| `ddl-auto` 값 | 동작 |
| --- | --- |
| `none` | 아무것도 안 함 (MySQL 같은 외부 DB에서 Spring Boot 기본값) |
| `validate` | 엔티티와 테이블이 맞는지만 검사 (이번 주차) |
| `update` | 엔티티에 맞춰 테이블을 고침 (컬럼 추가 등) |
| `create` / `create-drop` | 시작 시 테이블을 지우고 새로 만듦 / 종료 시 삭제 |

- **운영에서 자동 스키마 변경이 위험한 이유**: 엔티티 필드 이름만 바꿔도 새 컬럼이 생기거나(데이터가 옛 컬럼에 남음) `create`면 데이터가 전부 지워질 수 있다. 어떤 변경이 언제 적용됐는지 **기록과 리뷰가 없고**, 서버 여러 대가 동시에 바꾸려 할 수도 있다. 롤백도 어렵다.
- **Migration**: 스키마 변경을 버전이 붙은 SQL 파일(예: `V2__add_isbn_to_book.sql`)로 관리하고, 도구(Flyway, Liquibase, TypeORM migration)가 순서대로 한 번씩 적용한다. 코드 리뷰와 git 이력에 남는다.
- NestJS의 `synchronize: true`는 Spring의 `update`와 비슷한 자동 동기화라서 운영에서는 `false`로 둔다.
