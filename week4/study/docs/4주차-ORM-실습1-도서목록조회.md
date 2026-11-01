# 📖 4주차 실습 1 - ORM으로 도서 전체 목록 조회하기 (`GET /books`)

## 📌 요구사항
- 대여 가능 여부와 상관없이 **모든 도서를 최신 등록순**(`book_id` 내림차순)으로 조회한다.
- 응답에는 DB 컬럼명 대신 `bookId`, `title`, `description`, `categoryName`, `isAvailable`만 담는다.
- 스택: **Spring Boot 3.5.0 + Spring Data JPA (Hibernate 6.6.15) + MySQL 8.4**

## 🔄 흐름
```
GET /books
  → BookController.getBooks()
  → BookService.getBooks()            @Transactional(readOnly = true)
  → BookRepository.findAllByOrderByBookIdDesc()   (Book 엔티티 목록)
  → BookResponse.from(book)           (엔티티 → 응답 DTO)
  → JSON 응답 200
```

---

## 🧾 작성한 코드

### 1. 설정 (`build.gradle`, `application.yaml`)
```groovy
// 4주차: JdbcTemplate(starter-jdbc) 대신 JPA
implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
implementation 'org.springframework.boot:spring-boot-starter-validation'
```
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate   # 3주차 테이블을 그대로 쓰고, 엔티티와 구조가 맞는지만 검사
    open-in-view: false
    show-sql: true         # 실행되는 SQL을 콘솔에 출력
    properties:
      hibernate:
        format_sql: true
```

### 2. Entity (`entity/Category.java`, `entity/Book.java`)
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

### 3. Repository (`repository/BookRepository.java`)
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

### 4. 응답 DTO (`dto/BookResponse.java`)
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

### 5. Service · Controller (조회 부분)
```java
// BookService
@Transactional(readOnly = true)
public List<BookResponse> getBooks() {
    return bookRepository.findAllByOrderByBookIdDesc().stream()
            .map(BookResponse::from) // 엔티티 → 응답 DTO
            .toList();
}

// BookController (@RequestMapping("/books"))
@GetMapping
public List<BookResponse> getBooks() {
    return bookService.getBooks();
}
```

---

## 🔍 코드 설명

### 1. `@ManyToOne` - FK 숫자 대신 객체
- `book.category_id` 컬럼을 `Long categoryId` 필드로 두지 않고 `Category category` 객체로 연결했다. 1주차 ERD의 **category 1 : N book** 관계를 코드로 옮긴 것이다.
- 그래서 응답을 만들 때 `book.getCategory().getName()`처럼 객체를 따라가 카테고리 이름을 얻는다. 3주차 응답에는 `category_id` 숫자만 있었고, 이름을 보여 주려면 JOIN SQL을 직접 써야 했다.

### 2. 쿼리 메서드 `findAllByOrderByBookIdDesc`
- 메서드 이름을 `findAll` + `By` + `OrderBy` + `BookId` + `Desc`로 지으면 Spring Data JPA가 `... order by book_id desc` SQL을 만든다. 구현 클래스를 직접 작성하지 않는다.

### 3. `@EntityGraph`로 N+1 막기
- `category`는 `LAZY`라서, 그냥 조회하면 책 목록 SELECT 1번 뒤에 `getCategory().getName()`을 부를 때마다 카테고리 SELECT가 추가로 나간다(**N+1**).
- `@EntityGraph(attributePaths = "category")`를 붙여 책과 카테고리를 **JOIN 한 번**으로 가져왔다. 아래 실행 로그에서 SELECT가 1개뿐인 것을 확인했다.

### 4. 엔티티를 그대로 내보내지 않고 DTO로 변환
- 엔티티를 그대로 응답하면 `category` 객체 전체(또는 LAZY 프록시)가 JSON으로 나가고, DB 구조가 곧 API 모양이 된다.
- `BookResponse.from(book)`에서 API에 필요한 5개 필드만 골라 담고, 카테고리는 이름(`categoryName`)만 펼쳐서 내보낸다.
- `open-in-view: false`이므로 트랜잭션이 끝난 Controller에서는 LAZY 데이터를 읽을 수 없다. 그래서 **Service의 트랜잭션 안에서** DTO로 바꿔 반환한다.

### 5. `@Transactional(readOnly = true)`
- 조회 전용 트랜잭션이다. Hibernate가 변경 감지용 스냅샷을 만들지 않고 flush도 하지 않아 조회에 필요한 일만 한다.

---

## ✅ 실행 결과

### 응답 (`GET http://localhost:8080/books`) - 200 OK
```json
[
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
- 최신 등록순(`bookId` 3 → 2 → 1)으로 정렬되었다.
- 응답 키가 DB 컬럼명(`book_id`, `is_available`)이 아니라 DTO 필드명(`bookId`, `isAvailable`)이다.
- 카테고리는 숫자 ID 대신 이름(`문학`, `과학`)으로 나온다.

실습 2에서 책을 한 권 등록한 뒤 다시 조회하면 새 책(`bookId: 4`)이 맨 앞에 온다.
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

### Hibernate가 실행한 SQL (요청 1번당 1개)
```sql
select
    b1_0.book_id,
    b1_0.category_id,
    c1_0.category_id,
    c1_0.name,
    b1_0.description,
    b1_0.is_available,
    b1_0.title
from
    book b1_0
join
    category c1_0
        on c1_0.category_id=b1_0.category_id
order by
    b1_0.book_id desc
```
→ 책과 카테고리를 JOIN 한 번으로 가져왔다. 책마다 카테고리 SELECT가 따로 나가는 N+1이 없다.

### 3주차 `GET /books/category/{categoryId}`도 ORM으로 옮김
```java
@EntityGraph(attributePaths = "category")
List<Book> findAllByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);
```
`GET /books/category/1` 응답 (200):
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

### 테스트 (`BookRepositoryTest`)
3주차의 `List<Map>`을 확인하던 테스트를 `List<Book>`을 확인하도록 바꿨다. `./gradlew test` 결과 **2개 테스트 모두 성공**했고, 콘솔에는 다음이 출력되었다.
```text
4 | ORM으로 등록한 책 | 문학
3 | 우주를 읽는 법 | 과학
2 | 겨울의 편지 | 문학
1 | 달빛 도서관 | 문학
```

---

## 🆚 3주차와 달라진 점 (조회)
| | 3주차 | 4주차 |
| --- | --- | --- |
| Repository | `jdbcTemplate.queryForList("SELECT * FROM book")` | `findAllByOrderByBookIdDesc()` 메서드 선언만 |
| 반환 타입 | `List<Map<String, Object>>` | `List<Book>` → `List<BookResponse>` |
| 응답 키 | `book_id`, `category_id`, `is_available` (DB 컬럼명) | `bookId`, `categoryName`, `isAvailable` (API 필드명) |
| 카테고리 | `category_id` 숫자만 | JOIN으로 카테고리 이름까지 |
| 정렬 | 없음 | 최신 등록순 |

## 💡 배운 점
- `@ManyToOne` 하나로 FK를 객체 관계로 바꾸면 연관 데이터를 객체를 따라가며 읽을 수 있다.
- LAZY 연관은 편하지만 목록 조회에서 N+1을 만들 수 있으므로, `show-sql`로 실제 SQL 개수를 확인하고 `@EntityGraph`나 fetch join으로 함께 가져와야 한다.
- 엔티티는 DB 구조, DTO는 API 약속이다. 둘을 나누면 DB 컬럼 이름이 바뀌어도 API 응답은 그대로 둘 수 있다.
