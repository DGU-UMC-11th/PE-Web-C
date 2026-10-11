# 🔥 4주차 필수 미션 - Raw SQL 도서 API를 ORM(JPA)으로 리팩터링

> **미션 목표**: 3주차의 Raw SQL 기반 도서 API를 선택한 한 스택의 ORM 기반 API로 리팩터링한다.
> **선택 스택**: 🍃 Spring Boot 3.5.0 · Spring Data JPA (Hibernate 6.6.15) · MySQL 8.4 · Java 21

## 🗂️ 필수 구현 체크리스트

| 요구사항 | 구현 | 확인 |
| --- | --- | --- |
| `Book`, `Category` 엔티티와 다대일 관계 | `@ManyToOne(fetch = LAZY)` + `@JoinColumn(name = "category_id")` | ✅ `ddl-auto: validate` 통과 |
| `GET /books`: 도서 ID, 제목, 설명, 카테고리 이름, 대여 가능 여부를 최신순으로 | `findAllByOrderByBookIdDesc()` + `BookResponse` | ✅ 200, `bookId` 4 → 3 → 2 → 1 |
| `POST /books`: `categoryId`, `title`, `description`으로 등록하고 201 | `@ResponseStatus(CREATED)` + `bookRepository.save()` | ✅ 201, `bookId: 4` 생성 |
| DTO 검증 | `@NotNull`, `@NotBlank`, `@Size(max = 100)` + `@Valid` | ✅ 400 |
| 존재하지 않는 카테고리 예외 처리 | `CategoryNotFoundException` + `@RestControllerAdvice` | ✅ 404 |

## 📁 프로젝트 구조
3주차 원본(`study`)은 그대로 두고, 복사본 `study-orm`에서 ORM 버전을 작성했다.
```
study-orm/src/main/java/com/umc/study/
├── controller/
│   ├── BookController.java        ← GET/POST /books, GET /books/category/{id}
│   └── RentalController.java      (3주차 그대로)
├── dto/
│   ├── CreateBookRequest.java     ← 새로 추가 (요청 DTO + 검증)
│   ├── BookResponse.java          ← 새로 추가 (응답 DTO)
│   └── RentalRequest.java
├── entity/
│   ├── Book.java                  ← 새로 추가
│   └── Category.java              ← 새로 추가
├── exception/
│   ├── CategoryNotFoundException.java  ← 새로 추가
│   ├── ApiErrorResponse.java           ← 새로 추가
│   └── GlobalExceptionHandler.java     ← 새로 추가
├── repository/
│   ├── BookRepository.java        ← JdbcTemplate 클래스 → JpaRepository 인터페이스
│   ├── CategoryRepository.java    ← 새로 추가
│   └── RentalRepository.java      (3주차 그대로, JdbcTemplate)
└── service/
    ├── BookService.java           ← 엔티티 ↔ DTO 변환, 트랜잭션
    └── RentalService.java
```
- 대여 API(`POST /rentals`)는 이번 미션 범위가 아니어서 JdbcTemplate을 그대로 두었다. `spring-boot-starter-data-jpa`에 JDBC가 포함되어 있어 함께 동작한다.

---

## 🧾 핵심 코드

### Entity
```java
package com.umc.study.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// category 테이블 한 행 = Category 객체 하나
@Entity
@Table(name = "category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA가 객체를 만들 때 쓰는 기본 생성자 (외부에서 빈 객체 생성 금지)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT를 DB에 맡겨요.
    @Column(name = "category_id") // DB의 snake_case 컬럼명 ↔ 코드의 camelCase 필드명
    private Long categoryId;

    @Column(nullable = false)
    private String name;
}
```

```java
package com.umc.study.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

// book 테이블 한 행 = Book 객체 하나
@Entity
@Table(name = "book")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long bookId;

    // ERD의 category 1 : N book 관계. FK 숫자(category_id) 대신 Category 객체를 들고 있어요.
    // LAZY: 책을 조회할 때 카테고리는 실제로 필요할 때 가져와요.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // 새로 만든 책은 대여 가능 상태로 시작해요.
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    public Book(Category category, String title, String description) {
        this.category = category;
        this.title = title;
        this.description = description;
    }
}
```

### DTO
```java
package com.umc.study.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// POST /books 요청 Body: { "categoryId": 1, "title": "책 제목", "description": "설명(선택)" }
public record CreateBookRequest(
        @NotNull(message = "카테고리 ID는 필수입니다.")
        Long categoryId,

        @NotBlank(message = "제목은 비어 있을 수 없습니다.")
        @Size(max = 100, message = "제목은 100자 이하여야 합니다.")
        String title,

        String description
) {
}
```

```java
package com.umc.study.dto;

import com.umc.study.entity.Book;

// API 응답 모양. DB 컬럼(book_id, category_id ...) 대신 클라이언트와 약속한 필드만 내보내요.
public record BookResponse(
        Long bookId,
        String title,
        String description,
        String categoryName,
        Boolean isAvailable
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(),
                book.getIsAvailable()
        );
    }
}
```

### Repository
```java
package com.umc.study.repository;

import com.umc.study.entity.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 3주차: JdbcTemplate + SQL 문자열을 직접 작성
// 4주차: JpaRepository를 상속하면 save, findById, findAll 같은 기본 CRUD가 생기고,
//        메서드 이름 규칙(findAllBy...OrderBy...)으로 조회 SQL을 Spring Data JPA가 만들어 줘요.
public interface BookRepository extends JpaRepository<Book, Long> {

    // 최신 등록순 = book_id 내림차순
    // @EntityGraph: 책 목록과 카테고리를 JOIN 한 번으로 함께 가져와 N+1 쿼리를 막아요.
    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();

    // 3주차의 GET /books/category/{categoryId}도 ORM으로 옮겼어요.
    // Category_CategoryId: book.category.categoryId 경로로 조건을 걸어요.
    @EntityGraph(attributePaths = "category")
    List<Book> findAllByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);
}
```

```java
package com.umc.study.repository;

import com.umc.study.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
```

### Service
```java
package com.umc.study.service;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    // 조회만 하므로 readOnly 트랜잭션 (변경 감지 생략)
    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookRepository.findAllByOrderByBookIdDesc().stream()
                .map(BookResponse::from) // 엔티티 → 응답 DTO
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByCategory(Long categoryId) {
        return bookRepository.findAllByCategory_CategoryIdOrderByBookIdDesc(categoryId).stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        // 1. 없는 카테고리면 저장하지 않고 404로 응답
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        // 2. 엔티티 생성 → 3. 저장 → 4. 응답 DTO로 변환
        Book book = new Book(category, request.title(), request.description());
        return BookResponse.from(bookRepository.save(book));
    }
}
```

### Controller
```java
package com.umc.study.controller;

import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    // GET http://localhost:8080/books
    @GetMapping
    public List<BookResponse> getBooks() {
        return bookService.getBooks();
    }

    // GET http://localhost:8080/books/category/1
    @GetMapping("/category/{categoryId}")
    public List<BookResponse> getBooksByCategory(@PathVariable Long categoryId) {
        return bookService.getBooksByCategory(categoryId);
    }

    // POST http://localhost:8080/books
    // @Valid: 요청 Body가 Service에 도달하기 전에 CreateBookRequest의 검증 규칙을 확인해요.
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponse createBook(@Valid @RequestBody CreateBookRequest request) {
        return bookService.createBook(request);
    }
}
```

### 예외 처리
```java
package com.umc.study.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

// 컨트롤러에서 던져진 예외를 한곳에서 잡아 일정한 JSON 오류 응답으로 바꿔요.
// (처리하지 않으면 IllegalArgumentException 같은 예외는 500 Internal Server Error가 돼요.)
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 없는 categoryId → 404
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleCategoryNotFound(CategoryNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiErrorResponse.of(404, "CATEGORY_NOT_FOUND", e.getMessage()));
    }

    // @Valid 검증 실패 (빈 제목, 100자 초과, categoryId 누락) → 400
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity.badRequest()
                .body(new ApiErrorResponse(400, "INVALID_REQUEST", "요청 값이 올바르지 않습니다.", errors));
    }

    // JSON 형식이 깨졌거나 categoryId에 숫자가 아닌 값이 들어온 경우 → 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleNotReadable(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest()
                .body(ApiErrorResponse.of(400, "INVALID_JSON", "요청 Body를 읽을 수 없습니다. JSON 형식과 값의 타입을 확인해 주세요."));
    }
}
```

---

## 📮 실행 결과 (Postman 요청과 같은 HTTP 요청)

> 아래 결과는 `api-test.ps1`로 실제 서버(`localhost:8080`)와 로컬 MySQL에 보낸 요청의 응답이다. 제출용 캡처는 Postman에서 같은 요청을 보내 찍으면 된다. (POST는 Body → raw → JSON)

### 1. GET 성공 - `GET /books` → **200**
```json
[
  {
    "bookId": 4,
    "title": "ORM으로 등록한 책",
    "description": "4주차 미션 테스트",
    "categoryName": "문학",
    "isAvailable": true
  },
  {
    "bookId": 3,
    "title": "우주를 읽는 법",
    "description": "과학 교양",
    "categoryName": "과학",
    "isAvailable": true
  },
  {
    "bookId": 2,
    "title": "겨울의 편지",
    "description": "에세이",
    "categoryName": "문학",
    "isAvailable": false
  },
  {
    "bookId": 1,
    "title": "달빛 도서관",
    "description": "소설",
    "categoryName": "문학",
    "isAvailable": true
  }
]
```

### 2. POST 성공 - `POST /books` → **201 Created**
```json
// Body
{"categoryId":1,"title":"ORM으로 등록한 책","description":"4주차 미션 테스트"}
```
```json
{
  "bookId": 4,
  "title": "ORM으로 등록한 책",
  "description": "4주차 미션 테스트",
  "categoryName": "문학",
  "isAvailable": true
}
```

### 3. 없는 카테고리 - `POST /books` → **404 Not Found**
```json
// Body
{"categoryId":999,"title":"없는 카테고리 책","description":"오류 확인"}
```
```json
{
  "status": 404,
  "code": "CATEGORY_NOT_FOUND",
  "message": "존재하지 않는 카테고리입니다. (categoryId=999)"
}
```

### 4. 잘못된 요청 (빈 제목) - `POST /books` → **400 Bad Request**
```json
// Body
{"categoryId":1,"title":"","description":"오류 확인"}
```
```json
{
  "status": 400,
  "code": "INVALID_REQUEST",
  "message": "요청 값이 올바르지 않습니다.",
  "errors": {
    "title": "제목은 비어 있을 수 없습니다."
  }
}
```

### 추가로 확인한 오류
| 요청 | 상태 | 오류 내용 |
| --- | --- | --- |
| 제목이 공백만(`"   "`) | 400 | `title`: 제목은 비어 있을 수 없습니다. |
| `categoryId` 누락 | 400 | `categoryId`: 카테고리 ID는 필수입니다. |
| 제목 101자 | 400 | `title`: 제목은 100자 이하여야 합니다. |
| `categoryId: "abc"` | 400 | `INVALID_JSON` |

### 실행된 SQL (show-sql)
| 요청 | SQL |
| --- | --- |
| `GET /books` | `book JOIN category ... ORDER BY book_id DESC` **1개** |
| `POST /books` 성공 | `SELECT category WHERE category_id=?` → `INSERT INTO book` |
| `POST /books` 없는 카테고리 | `SELECT category WHERE category_id=?` 만 (INSERT 없음) |
| `POST /books` 검증 실패 | **없음** (DB에 닿기 전에 400) |

### 테스트
`./gradlew test` → `StudyApplicationTests`, `BookRepositoryTest` **2개 모두 성공**

---

## 🆚 3주차 Raw SQL 방식과 비교해 바뀐 점

1. **SQL 문자열 대신 엔티티와 Repository 메서드로 DB를 다룬다.** 3주차에는 `"SELECT * FROM book"`, `"INSERT ... VALUES (?, ?, ...)"` 같은 SQL 문자열과 `?` 파라미터 순서를 직접 관리했지만, 4주차에는 `Book`/`Category` 엔티티로 테이블 구조를 한 번 정의하고 `findAllByOrderByBookIdDesc()`, `save()` 같은 메서드로 조회·저장한다. 실제 SQL은 Hibernate가 만들어 실행한다.
2. **결과가 `Map`이 아니라 타입이 있는 객체가 된다.** 3주차 Repository는 `List<Map<String, Object>>`를 돌려줘서 `"title"` 같은 컬럼명 문자열로 값을 꺼내야 했고, 오타는 실행해 봐야 알 수 있었다. 4주차에는 `book.getTitle()`, `book.getCategory().getName()`처럼 필드와 연관 객체를 컴파일러가 확인한다.
3. **FK 숫자가 객체 관계가 된다.** 3주차 응답에는 `category_id` 숫자만 있었지만, 4주차에는 `@ManyToOne`으로 연결된 `Category`를 따라가 카테고리 이름을 응답에 넣었다. 이때 N+1이 생기지 않도록 `@EntityGraph`로 JOIN 한 번에 가져왔다.
4. **API 약속(DTO)과 DB 구조(Entity)가 분리된다.** 3주차에는 DB 컬럼명(`book_id`, `is_available`)이 그대로 응답 키였지만, 4주차에는 `BookResponse`가 `bookId`, `categoryName`, `isAvailable`만 골라 내보낸다. 요청도 `CreateBookRequest`에서 검증해 잘못된 값은 DB에 닿기 전에 400으로 돌려보낸다.
5. **그래도 DB 지식은 그대로 필요하다.** `ddl-auto: validate`로 엔티티가 3주차 테이블과 정확히 맞는지 확인해야 했고, `show-sql`로 실제 SQL과 개수를 확인해 N+1을 잡았다. ORM은 SQL을 없애는 도구가 아니라 반복 코드를 줄여 주는 도구였다.

## ✔️ 요구사항 검증 (한 문장)
`GET /books`는 도서 4권을 `bookId` 내림차순으로 `bookId·title·description·categoryName·isAvailable`만 담아 200으로 반환했고, `POST /books`는 정상 요청에 201과 새 도서(`bookId: 4`)를, 없는 카테고리에 404를, 빈 제목 등 잘못된 요청에 400을 반환해 미션 요구사항과 일치한다.

---

## 🧯 참고 / 트러블 슈팅
- **스키마 검증**: 3주차 테이블을 그대로 쓰기 위해 `ddl-auto: validate`를 썼다. 엔티티의 테이블·컬럼 이름과 타입이 맞지 않으면 서버 시작 단계에서 `Schema-validation` 오류로 멈추는데, 이번에는 한 번에 통과했다.
- **워크북 예시와 다르게 한 부분**: 워크북은 없는 카테고리에 `IllegalArgumentException`을 던지는데, 처리하지 않으면 500이 된다. 클라이언트 잘못임을 알리도록 전용 예외와 `@RestControllerAdvice`로 404를 반환했다.
- **카테고리별 조회 SQL**: `findAllByCategory_CategoryIdOrderByBookIdDesc`에 `@EntityGraph`를 붙였더니, Hibernate가 WHERE 조건용 `left join category`와 fetch용 `join category`를 따로 만들어 같은 테이블을 두 번 JOIN했다. 결과는 맞지만, JPQL로 직접 쓰면 JOIN을 하나로 줄일 수 있다.
  ```java
  @Query("select b from Book b join fetch b.category where b.category.categoryId = :categoryId order by b.bookId desc")
  List<Book> findAllByCategoryId(@Param("categoryId") Long categoryId);
  ```

## ▶️ 실행 방법
```powershell
cd C:\Users\82102\Desktop\study\study-orm
.\gradlew.bat bootRun                       # 서버 실행 (DB 접속 정보는 .env)
# 또는 자동 점검
powershell -ExecutionPolicy Bypass -File .\api-test.ps1
```
