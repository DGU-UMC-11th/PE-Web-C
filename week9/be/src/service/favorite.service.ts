import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { FavoriteResponseDto } from '../dto/favorite-response.dto';
import { FavoriteStatusResponseDto } from '../dto/favorite-status-response.dto';
import { Favorite } from '../entity/favorite.entity';
import { Member } from '../entity/member.entity';
import { isDuplicateEntryError } from '../exception/db-error';
import { apiException } from '../exception/error-code';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async create(
    memberId: number,
    dto: CreateFavoriteDto,
  ): Promise<FavoriteResponseDto> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw apiException('MEMBER_NOT_FOUND');
    }

    // 사전 검사는 명확한 오류 코드를 주기 위한 것
    const alreadyFavorite = await this.favoriteRepository.exists({
      where: { member: { memberId }, movieId: dto.movieId },
    });
    if (alreadyFavorite) {
      throw apiException('FAVORITE_DUPLICATED');
    }

    try {
      const savedFavorite = await this.favoriteRepository.save(
        this.favoriteRepository.create({ member, movieId: dto.movieId }),
      );
      return FavoriteResponseDto.from(savedFavorite);
    } catch (error) {
      // 동시 요청이 사전 검사를 같이 통과해도 DB UNIQUE 제약이 막아 줌
      if (isDuplicateEntryError(error)) {
        throw apiException('FAVORITE_DUPLICATED');
      }
      throw error;
    }
  }

  async getMyFavorites(memberId: number): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteRepository.find({
      where: { member: { memberId } },
      order: { favoriteId: 'DESC' },
    });

    return favorites.map((favorite) => FavoriteResponseDto.from(favorite));
  }

  // 즐겨찾기하지 않은 것도 정상 상태라서 404가 아니라 false로 응답
  async getStatus(
    memberId: number,
    movieId: number,
  ): Promise<FavoriteStatusResponseDto> {
    const isFavorite = await this.favoriteRepository.exists({
      where: { member: { memberId }, movieId },
    });

    return FavoriteStatusResponseDto.from(isFavorite);
  }

  async delete(memberId: number, movieId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { member: { memberId }, movieId },
    });
    if (!favorite) {
      throw apiException('FAVORITE_NOT_FOUND');
    }

    await this.favoriteRepository.remove(favorite);
  }
}
