import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, MaxLength, Min } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({ description: 'TMDB 영화 ID', example: 550 })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @Min(1, { message: '영화 ID는 양수여야 합니다.' })
  movieId: number;

  @ApiProperty({ description: '1점 이상 5점 이하의 별점', example: 5 })
  @IsInt({ message: '별점은 정수여야 합니다.' })
  @Min(1, { message: '별점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '별점은 5점 이하여야 합니다.' })
  score: number;

  @ApiPropertyOptional({
    description: '500자 이하의 후기 (선택)',
    example: '다시 봐도 명작이에요.',
  })
  @IsOptional()
  @MaxLength(500, { message: '후기는 500자 이하로 입력해주세요.' })
  comment?: string;
}
