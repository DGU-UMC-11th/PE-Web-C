package com.umc.study.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 즐겨찾기는 영화의 속성이 아니라 "회원과 영화의 관계"예요.
 * 어떤 회원에게는 좋아하는 영화여도 다른 회원에게는 아닐 수 있으니까요.
 */
@Entity
@Table(
        name = "favorite",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_favorite_member_movie",
                columnNames = {"member_id", "movie_id"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Favorite extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long favoriteId;

    // 즐겨찾기의 주인은 로그인한 회원이에요.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // TMDB의 영화 ID를 그대로 저장해요. 우리 DB의 외래 키는 아니에요.
    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Builder
    public Favorite(Member member, Long movieId) {
        this.member = member;
        this.movieId = movieId;
    }
}
