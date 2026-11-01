import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingResponseDto } from '../dto/rating-response.dto';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';

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
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const ratings = await this.ratingRepository.find({
      where: { member: { memberId } },
      order: { ratingId: 'DESC' },
    });

    return ratings.map((rating) => RatingResponseDto.from(rating));
  }
}
