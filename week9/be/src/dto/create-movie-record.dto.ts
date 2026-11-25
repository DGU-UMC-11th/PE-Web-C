import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMovieRecordDto {
  @ApiProperty({ description: 'TMDB 영화 ID', example: 238 })
  @IsNotEmpty({ message: '영화 ID는 필수입니다.' })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @IsPositive({ message: '영화 ID는 양수여야 합니다.' })
  movieId: number;

  @ApiProperty({ description: '1점 이상 5점 이하의 별점', example: 5 })
  @IsNotEmpty({ message: '별점은 필수입니다.' })
  @IsInt({ message: '별점은 정수여야 합니다.' })
  @Min(1, { message: '별점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '별점은 5점 이하여야 합니다.' })
  score: number;

  @ApiPropertyOptional({
    description: '500자 이하의 후기 (선택)',
    example: '다시 보고 싶은 영화입니다.',
  })
  @IsOptional()
  @IsString({ message: '후기는 문자열이어야 합니다.' })
  @MaxLength(500, { message: '후기는 500자 이하로 입력해주세요.' })
  comment?: string;

  @ApiProperty({
    description: 'true면 평점과 함께 즐겨찾기도 저장',
    example: true,
  })
  @IsBoolean({ message: '즐겨찾기 추가 여부는 true 또는 false여야 합니다.' })
  addToFavorites: boolean;
}
