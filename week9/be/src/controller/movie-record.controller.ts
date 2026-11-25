import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateMovieRecordDto } from '../dto/create-movie-record.dto';
import { AuthGuard } from '../guard/auth.guard';
import { MovieRecordService } from '../service/movie-record.service';
import {
  ApiCommonFailureResponse,
  ApiFailureResponse,
  ApiSuccessResponse,
  ApiTokenRequired,
} from '../swagger/api-response.decorator';

@ApiTags('영화 기록')
@ApiTokenRequired()
@Controller('movie-records')
@UseGuards(AuthGuard)
export class MovieRecordController {
  constructor(private readonly movieRecordService: MovieRecordService) {}

  @ApiOperation({
    summary: '영화 기록 저장 (토큰 필요)',
    description:
      '평점과 즐겨찾기를 하나의 트랜잭션으로 저장합니다. 하나라도 실패하면 둘 다 저장되지 않고, addToFavorites가 false면 평점만 저장합니다.',
  })
  @ApiSuccessResponse(201, '영화 기록을 저장했습니다.', {
    rating: {
      ratingId: 1,
      movieId: 238,
      score: 5,
      comment: '다시 보고 싶은 영화입니다.',
      createdAt: '2026-09-13T21:00:00.000Z',
      updatedAt: '2026-09-13T21:00:00.000Z',
    },
    favorite: {
      favoriteId: 1,
      movieId: 238,
      createdAt: '2026-09-13T21:00:00.000Z',
    },
  })
  @ApiCommonFailureResponse(400, '별점은 5점 이하여야 합니다.')
  @ApiFailureResponse('MEMBER_NOT_FOUND')
  @ApiFailureResponse('RATING_DUPLICATED', 'FAVORITE_DUPLICATED')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateMovieRecordDto) {
    const memberId = request['memberId'] as number;

    const result = await this.movieRecordService.create(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '영화 기록을 저장했습니다.',
      result,
    };
  }
}
