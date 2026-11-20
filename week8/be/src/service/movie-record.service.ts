import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMovieRecordDto } from '../dto/create-movie-record.dto';
import { FavoriteResponseDto } from '../dto/favorite-response.dto';
import { MovieRecordResponseDto } from '../dto/movie-record-response.dto';
import { RatingResponseDto } from '../dto/rating-response.dto';
import { Favorite } from '../entity/favorite.entity';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';
import { isDuplicateEntryError } from '../exception/db-error';
import { apiException } from '../exception/error-code';

@Injectable()
export class MovieRecordService {
  constructor(private readonly dataSource: DataSource) {}

  // 평점과 즐겨찾기를 한 트랜잭션으로 묶어서 둘 중 하나만 저장되는 일을 막음
  async create(
    memberId: number,
    dto: CreateMovieRecordDto,
  ): Promise<MovieRecordResponseDto> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // 콜백 안에서는 manager가 만든 Repository만 써야 같은 트랜잭션 연결을 씀
        const memberRepository = manager.getRepository(Member);
        const ratingRepository = manager.getRepository(Rating);
        const favoriteRepository = manager.getRepository(Favorite);

        const member = await memberRepository.findOneBy({ memberId });
        if (!member) {
          throw apiException('MEMBER_NOT_FOUND');
        }

        const alreadyRated = await ratingRepository.exists({
          where: { member: { memberId }, movieId: dto.movieId },
        });
        if (alreadyRated) {
          throw apiException('RATING_DUPLICATED');
        }

        if (dto.addToFavorites) {
          const alreadyFavorite = await favoriteRepository.exists({
            where: { member: { memberId }, movieId: dto.movieId },
          });
          if (alreadyFavorite) {
            throw apiException('FAVORITE_DUPLICATED');
          }
        }

        const savedRating = await ratingRepository.save(
          ratingRepository.create({
            member,
            movieId: dto.movieId,
            score: dto.score,
            comment: dto.comment ?? null,
          }),
        );

        let favoriteResponse: FavoriteResponseDto | null = null;
        if (dto.addToFavorites) {
          const savedFavorite = await favoriteRepository.save(
            favoriteRepository.create({ member, movieId: dto.movieId }),
          );
          favoriteResponse = FavoriteResponseDto.from(savedFavorite);
        }

        return MovieRecordResponseDto.of(
          RatingResponseDto.from(savedRating),
          favoriteResponse,
        );
      });
    } catch (error) {
      // 콜백에서 예외가 나면 이미 rollback된 상태라 응답 형식만 맞춤
      if (isDuplicateEntryError(error)) {
        const isFavoriteKey = String((error as Error).message).includes(
          'uk_favorite_member_movie',
        );
        throw apiException(
          isFavoriteKey ? 'FAVORITE_DUPLICATED' : 'RATING_DUPLICATED',
        );
      }
      throw error;
    }
  }
}
