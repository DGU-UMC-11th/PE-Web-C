import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class MemberUpdateRequestDto {
  @ApiProperty({
    description: '2자 이상 12자 이하의 새 닉네임',
    example: '영화매니아',
  })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @Length(2, 12, { message: '닉네임은 2자 이상 12자 이하여야 합니다.' })
  nickname: string;
}
