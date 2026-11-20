import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { RatingResponseDto } from '../dto/rating-response.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';
import { apiException } from '../exception/error-code';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async getRatingsByMember(memberId: number): Promise<RatingResponseDto[]> {
    const memberExists = await this.memberRepository.exists({
      where: { memberId },
    });
    if (!memberExists) {
      throw apiException('MEMBER_NOT_FOUND');
    }

    const ratings = await this.ratingRepository.find({
      where: { member: { memberId } },
      order: { ratingId: 'DESC' },
    });

    return ratings.map((rating) => RatingResponseDto.from(rating));
  }

  // memberId는 요청이 아니라 토큰에서 꺼낸 값이라 항상 첫 번째 인자로 받음
  async create(
    memberId: number,
    dto: CreateRatingDto,
  ): Promise<RatingResponseDto> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw apiException('MEMBER_NOT_FOUND');
    }

    const alreadyRated = await this.ratingRepository.exists({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (alreadyRated) {
      throw apiException('RATING_DUPLICATED');
    }

    const savedRating = await this.ratingRepository.save(
      this.ratingRepository.create({
        member,
        movieId: dto.movieId,
        score: dto.score,
        comment: dto.comment ?? null,
      }),
    );

    return RatingResponseDto.from(savedRating);
  }

  async update(
    memberId: number,
    ratingId: number,
    dto: UpdateRatingDto,
  ): Promise<RatingResponseDto> {
    const rating = await this.findOwnedRating(memberId, ratingId);

    rating.score = dto.score;
    rating.comment = dto.comment ?? null;

    const savedRating = await this.ratingRepository.save(rating);
    return RatingResponseDto.from(savedRating);
  }

  async delete(memberId: number, ratingId: number): Promise<void> {
    const rating = await this.findOwnedRating(memberId, ratingId);

    await this.ratingRepository.remove(rating);
  }

  // 평점이 있는지 먼저 보고(404), 그다음 작성자를 비교(403)
  private async findOwnedRating(
    memberId: number,
    ratingId: number,
  ): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true },
    });

    if (!rating) {
      throw apiException('RATING_NOT_FOUND');
    }

    if (rating.member.memberId !== memberId) {
      throw apiException('RATING_FORBIDDEN');
    }

    return rating;
  }
}
