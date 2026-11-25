import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { AuthGuard } from '../guard/auth.guard';
import { FavoriteService } from '../service/favorite.service';
import {
  ApiCommonFailureResponse,
  ApiFailureResponse,
  ApiSuccessResponse,
  ApiTokenRequired,
} from '../swagger/api-response.decorator';

const FAVORITE_EXAMPLE = {
  favoriteId: 1,
  movieId: 550,
  createdAt: '2026-09-13T21:00:00.000Z',
};

// 즐겨찾기는 전부 로그인한 회원의 데이터라 컨트롤러 전체에 Guard와 자물쇠를 붙임
@ApiTags('즐겨찾기')
@ApiTokenRequired()
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiOperation({
    summary: '즐겨찾기 등록 (토큰 필요)',
    description: '토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다.',
  })
  @ApiSuccessResponse(201, '즐겨찾기를 등록했습니다.', FAVORITE_EXAMPLE)
  @ApiCommonFailureResponse(400, '영화 ID는 양수여야 합니다.')
  @ApiFailureResponse('MEMBER_NOT_FOUND')
  @ApiFailureResponse('FAVORITE_DUPLICATED')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() request: Request, @Body() dto: CreateFavoriteDto) {
    const memberId = request['memberId'] as number;

    const result = await this.favoriteService.create(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '즐겨찾기를 등록했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '내 즐겨찾기 조회 (토큰 필요)',
    description: '내 즐겨찾기를 최신 등록 순으로 조회합니다. 없으면 빈 배열입니다.',
  })
  @ApiSuccessResponse(200, '내 즐겨찾기 목록을 조회했습니다.', [
    FAVORITE_EXAMPLE,
  ])
  @Get()
  async getMyFavorites(@Req() request: Request) {
    const memberId = request['memberId'] as number;

    const result = await this.favoriteService.getMyFavorites(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '내 즐겨찾기 목록을 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '즐겨찾기 여부 조회 (토큰 필요)',
    description:
      '영화 하나를 즐겨찾기했는지 조회합니다. 즐겨찾기하지 않은 것도 정상 상태라 404가 아니라 false로 응답합니다.',
  })
  @ApiSuccessResponse(200, '즐겨찾기 여부를 조회했습니다.', {
    isFavorite: true,
  })
  @Get(':movieId')
  async getStatus(
    @Req() request: Request,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.favoriteService.getStatus(memberId, movieId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기 여부를 조회했습니다.',
      result,
    };
  }

  // 공통 응답 형식을 담기 위해 204 대신 200
  @ApiOperation({
    summary: '즐겨찾기 해제 (토큰 필요)',
    description: '즐겨찾기한 영화를 목록에서 뺍니다.',
  })
  @ApiSuccessResponse(200, '즐겨찾기를 해제했습니다.', null)
  @ApiFailureResponse('FAVORITE_NOT_FOUND')
  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: Request,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;

    await this.favoriteService.delete(memberId, movieId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기를 해제했습니다.',
      result: null,
    };
  }
}
