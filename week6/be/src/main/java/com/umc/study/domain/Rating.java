package com.umc.study.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "rating",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_rating_member_movie",
                columnNames = {"member_id", "movie_id"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Rating extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;

    // 평점 N : 회원 1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // TMDB가 부여한 영화 식별자를 그대로 담는 일반 컬럼이에요. 우리 DB의 FK가 아니에요.
    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(nullable = false, columnDefinition = "TINYINT")
    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Builder
    public Rating(Member member, Long movieId, Integer score, String comment) {
        this.member = member;
        this.movieId = movieId;
        this.score = score;
        this.comment = comment;
    }

    // 엔티티가 자기 상태를 바꾸는 메서드를 갖게 해서, 서비스에서 setter로 흩뿌리지 않아요.
    public void update(Integer score, String comment) {
        this.score = score;
        this.comment = comment;
    }
}
