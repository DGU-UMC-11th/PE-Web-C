# ✍️ 4주차 실습 2 - 신규 도서 등록하기 (`POST /books`)

## 📌 요구사항
- 관리자가 `categoryId`, `title`, `description`을 보내면 새 도서를 등록하고 **`201 Created`** 를 반환한다.
- 존재하지 않는 `categoryId`는 저장하지 않고 오류로 응답한다.
- 요청 DTO 검증: `categoryId`는 비어 있지 않은 숫자, `title`은 비어 있지 않고 100자 이하, `description`은 선택.

## 🔄 구현 순서
1. 요청 DTO(`CreateBookRequest`) 검증을 통과한 데이터를 받는다. (`@Valid`)
2. `CategoryRepository`로 `categoryId`가 존재하는지 확인한다. 없으면 404.
3. `Book` 엔티티를 생성해 저장한다.
4. 저장된 엔티티를 응답 DTO(`BookResponse`)로 바꿔 201로 반환한다.

---

## 🧾 작성한 코드

### 1. 요청 DTO (`dto/CreateBookRequest.java`)
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

### 2. Repository (`repository/CategoryRepository.java`)
```java
package com.umc.study.repository;

import com.umc.study.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
```

### 3. Service 저장 로직 (`service/BookService.java`)
```java
@Transactional
public BookResponse createBook(CreateBookRequest request) {
    // 1. 없는 카테고리면 저장하지 않고 404로 응답
    Category category = categoryRepository.findById(request.categoryId())
            .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

    // 2. 엔티티 생성 → 3. 저장 → 4. 응답 DTO로 변환
    Book book = new Book(category, request.title(), request.description());
    return BookResponse.from(bookRepository.save(book));
}
```

### 4. Controller (`controller/BookController.java`)
```java
// POST http://localhost:8080/books
// @Valid: 요청 Body가 Service에 도달하기 전에 CreateBookRequest의 검증 규칙을 확인해요.
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public BookResponse createBook(@Valid @RequestBody CreateBookRequest request) {
    return bookService.createBook(request);
}
```

### 5. 예외 처리 (`exception/`)
```java
package com.umc.study.exception;

public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(Long categoryId) {
        super("존재하지 않는 카테고리입니다. (categoryId=" + categoryId + ")");
    }
}
```

```java
package com.umc.study.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

// 오류 응답 모양. errors는 검증 실패일 때만 "필드명: 메시지"로 담아요.
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiErrorResponse(
        int status,
        String code,
        String message,
        Map<String, String> errors
) {
    public static ApiErrorResponse of(int status, String code, String message) {
        return new ApiErrorResponse(status, code, message, null);
    }
}
```

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

## 🔍 코드 설명

### 1. 검증은 Controller 앞단에서, 존재 확인은 Service에서
| 오류 | 어디서 걸러지나 | 상태 코드 |
| --- | --- | --- |
| 빈 제목 / 공백 제목 / 100자 초과 / `categoryId` 누락 | `@Valid` → `MethodArgumentNotValidException` | 400 `INVALID_REQUEST` |
| JSON 깨짐, `categoryId`에 문자 | JSON → 객체 변환 단계 → `HttpMessageNotReadableException` | 400 `INVALID_JSON` |
| 없는 `categoryId` | Service의 `categoryRepository.findById` → `CategoryNotFoundException` | 404 `CATEGORY_NOT_FOUND` |

- `@NotBlank`는 `null`, `""`, `"   "`을 모두 막는다. `@NotEmpty`였다면 공백만 있는 제목은 통과했을 것이다.
- "카테고리가 DB에 있는가"는 DB를 조회해야 알 수 있으므로 DTO 검증이 아니라 Service에서 확인한다.

### 2. 왜 `IllegalArgumentException` 대신 직접 만든 예외인가
- 워크북 예시처럼 `IllegalArgumentException`을 던지고 아무 처리도 하지 않으면 Spring은 **500 Internal Server Error**로 응답한다. 클라이언트 잘못(없는 카테고리)인데 서버 오류처럼 보인다.
- `CategoryNotFoundException`을 만들고 `@RestControllerAdvice`에서 404로 바꿨다. 오류 응답 모양(`status`, `code`, `message`, `errors`)도 한곳에서 통일했다.

### 3. `save()` 직후 `bookId`가 채워지는 이유 (IDENTITY 전략)
- JPA는 보통 변경 내용을 모아 두었다가 커밋할 때 SQL을 보낸다(쓰기 지연).
- 하지만 `@GeneratedValue(strategy = IDENTITY)`는 PK를 DB의 `AUTO_INCREMENT`가 정하므로, Hibernate가 PK를 알기 위해 `save()` 시점에 INSERT를 **바로** 실행한다. 그래서 응답에 새 `bookId`(4)가 들어 있다.

### 4. `isAvailable`은 요청에서 받지 않는다
- 새 책은 항상 대여 가능 상태로 시작하므로 엔티티 필드 기본값(`= true`)으로 정했다. 클라이언트가 임의로 `false`인 새 책을 만들 수 없다.

### 5. `@Transactional`
- 카테고리 조회와 도서 저장을 한 트랜잭션으로 묶는다. 중간에 예외가 나면 롤백된다.

---

## ✅ 실행 결과

### 1. 등록 성공 - **201 Created**
요청
```http
POST http://localhost:8080/books
Content-Type: application/json

{"categoryId":1,"title":"ORM으로 등록한 책","description":"4주차 미션 테스트"}
```
응답
```json
{
  "bookId": 4,
  "title": "ORM으로 등록한 책",
  "description": "4주차 미션 테스트",
  "categoryName": "문학",
  "isAvailable": true
}
```
실행된 SQL - 카테고리 존재 확인 1번 + INSERT 1번
```sql
select c1_0.category_id, c1_0.name
from category c1_0
where c1_0.category_id=?

insert into book (category_id, description, is_available, title)
values (?, ?, ?, ?)
```
- `INSERT`에 `is_available`이 들어간 것은 엔티티 기본값 `true` 때문이다.
- 등록 후 `GET /books`를 다시 호출하면 새 책(`bookId: 4`)이 맨 앞에 온다.

### 2. 오류 응답

| # | 요청 Body | 상태 | 응답 |
| --- | --- | --- | --- |
| ① | `{"categoryId":999,"title":"없는 카테고리 책",...}` | **404** | `{"status":404,"code":"CATEGORY_NOT_FOUND","message":"존재하지 않는 카테고리입니다. (categoryId=999)"}` |
| ② | `{"categoryId":1,"title":"",...}` | **400** | `{"status":400,"code":"INVALID_REQUEST","message":"요청 값이 올바르지 않습니다.","errors":{"title":"제목은 비어 있을 수 없습니다."}}` |
| ③ | `{"categoryId":1,"title":"   ",...}` | **400** | `{"status":400,"code":"INVALID_REQUEST","message":"요청 값이 올바르지 않습니다.","errors":{"title":"제목은 비어 있을 수 없습니다."}}` |
| ④ | `{"title":"카테고리 없는 책"}` | **400** | `{"status":400,"code":"INVALID_REQUEST","message":"요청 값이 올바르지 않습니다.","errors":{"categoryId":"카테고리 ID는 필수입니다."}}` |
| ⑤ | `{"categoryId":1,"title":"가"×101}` | **400** | `{"status":400,"code":"INVALID_REQUEST","message":"요청 값이 올바르지 않습니다.","errors":{"title":"제목은 100자 이하여야 합니다."}}` |
| ⑥ | `{"categoryId":"abc","title":"타입 오류"}` | **400** | `{"status":400,"code":"INVALID_JSON","message":"요청 Body를 읽을 수 없습니다. JSON 형식과 값의 타입을 확인해 주세요."}` |

### 3. 오류 요청에서 실행된 SQL
- ① 없는 카테고리: `select ... from category where category_id=?` **1개만** 실행되고 INSERT는 없었다. → 저장하지 않고 404.
- ②~⑥ 검증 실패: SQL이 **하나도** 실행되지 않았다. → `@Valid`가 Service와 DB에 닿기 전에 막았다.

### 4. 워크북 실습 체크리스트
- [x] Spring Boot 또는 NestJS 중 한 스택의 ORM 설정을 완료했다. → Spring Boot + JPA, `ddl-auto: validate` 통과
- [x] `Book`과 `Category`의 PK/FK 관계를 엔티티로 표현했다. → `@ManyToOne` + `@JoinColumn(name = "category_id")`
- [x] 요청 DTO에 제목과 카테고리 ID 검증을 적용했다. → `@NotNull`, `@NotBlank`, `@Size(max = 100)`
- [x] `GET /books`가 ORM Repository를 통해 도서 목록을 반환한다. → 실습 1
- [x] `POST /books`가 새 도서를 저장하고 201 상태 코드를 반환한다. → 결과 1
- [x] 존재하지 않는 카테고리와 빈 제목 요청에서 오류 응답을 확인했다. → 결과 2의 ①, ②

---

## 🆚 3주차와 달라진 점 (저장)
| | 3주차 (`POST /rentals`) | 4주차 (`POST /books`) |
| --- | --- | --- |
| 저장 | `INSERT INTO rental (...) VALUES (?, ?, NOW(), ...)` 문자열 | `bookRepository.save(new Book(...))` |
| 요청 검증 | 없음 (`null`이어도 DB까지 감) | `@Valid` + Bean Validation, 실패 시 400 |
| 없는 FK | DB 제약 오류 → 500 | 먼저 조회해 404 |
| 응답 | `"대여 기록이 생성되었습니다."` 문자열 | 저장된 도서를 `BookResponse` JSON으로 |

## 💡 배운 점
- 요청 검증을 DTO 어노테이션으로 선언하면 규칙이 한눈에 보이고, 잘못된 요청은 DB에 닿기 전에 걸러진다.
- 예외를 처리하지 않으면 클라이언트 실수도 500이 된다. 예외 종류마다 알맞은 상태 코드로 바꿔 주는 것이 API 약속의 일부다.
- `IDENTITY` 전략에서는 `save()`가 즉시 INSERT를 실행한다. 쓰기 지연이 항상 일어나는 것은 아니다.
