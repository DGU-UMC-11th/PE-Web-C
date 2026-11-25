import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { AuthGuard } from '../guard/auth.guard';
import { RatingService } from '../service/rating.service';
import {
  ApiCommonFailureResponse,
  ApiFailureResponse,
  ApiSuccessResponse,
  ApiTokenRequired,
} from '../swagger/api-response.decorator';

const RATING_EXAMPLE = {
  ratingId: 1,
  movieId: 550,
  score: 5,
  comment: '다시 봐도 명작이에요.',
  createdAt: '2026-09-13T21:00:00.000Z',
  updatedAt: '2026-09-13T21:00:00.000Z',
};

@ApiTags('평점')
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // 회원별 평점 조회는 공개 API라 Guard를 붙이지 않음
  @ApiOperation({
    summary: '유저별 평점 조회 (토큰 불필요)',
    description:
      '회원 한 명이 남긴 평점을 최신순으로 조회합니다. 누구나 볼 수 있는 공개 API입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '평점 배열 (공통 응답 형식 없이 그대로 응답)',
    schema: { example: [RATING_EXAMPLE] },
  })
  @ApiFailureResponse('MEMBER_NOT_FOUND')
  @Get('members/:memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @ApiOperation({
    summary: '평점 등록 (토큰 필요)',
    description: '토큰의 주인인 회원이 영화 한 편에 평점을 남깁니다.',
  })
  @ApiTokenRequired()
  @ApiSuccessResponse(201, '평점을 등록했습니다.', RATING_EXAMPLE)
  @ApiCommonFailureResponse(400, '별점은 5점 이하여야 합니다.')
  @ApiFailureResponse('MEMBER_NOT_FOUND')
  @ApiFailureResponse('RATING_DUPLICATED')
  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateRatingDto) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.create(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '평점 수정 (토큰 필요)',
    description: '내가 남긴 평점의 별점과 후기를 수정합니다.',
  })
  @ApiTokenRequired()
  @ApiSuccessResponse(200, '평점을 수정했습니다.', {
    ...RATING_EXAMPLE,
    score: 4,
    comment: '두 번째 보니 조금 아쉬웠어요.',
  })
  @ApiCommonFailureResponse(400, '별점은 5점 이하여야 합니다.')
  @ApiFailureResponse('RATING_FORBIDDEN')
  @ApiFailureResponse('RATING_NOT_FOUND')
  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  async update(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.ratingService.update(memberId, ratingId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 수정했습니다.',
      result,
    };
  }

  // 공통 응답 형식을 담기 위해 204 대신 200
  @ApiOperation({
    summary: '평점 삭제 (토큰 필요)',
    description: '내가 남긴 평점을 삭제합니다.',
  })
  @ApiTokenRequired()
  @ApiSuccessResponse(200, '평점을 삭제했습니다.', null)
  @ApiFailureResponse('RATING_FORBIDDEN')
  @ApiFailureResponse('RATING_NOT_FOUND')
  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    const memberId = request['memberId'] as number;

    await this.ratingService.delete(memberId, ratingId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 삭제했습니다.',
      result: null,
    };
  }
}
