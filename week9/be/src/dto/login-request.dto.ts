import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: '가입할 때 사용한 이메일',
    example: 'challenger@umc.com',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  // 가입 규칙이 바뀌어도 기존 회원이 로그인할 수 있도록 비밀번호 규칙은 검사하지 않음
  @ApiProperty({ description: '가입할 때 사용한 비밀번호', example: 'Umc1234!' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
