import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from '../dto/login-request.dto';
import { AuthService } from '../service/auth.service';
import {
  ApiCommonFailureResponse,
  ApiFailureResponse,
  ApiSuccessResponse,
} from '../swagger/api-response.decorator';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '이메일 로그인 (토큰 불필요)',
    description:
      '이메일과 비밀번호로 로그인하고 Access Token을 발급받습니다. 발급받은 토큰은 위쪽 Authorize 버튼에 넣어두면 인증이 필요한 API에 자동으로 실립니다.',
  })
  @ApiSuccessResponse(200, '로그인에 성공했습니다.', {
    nickname: '영화조아',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiCommonFailureResponse(400, '올바른 이메일 형식이 아닙니다.')
  @ApiFailureResponse('AUTH_INVALID_CREDENTIALS')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto) {
    const result = await this.authService.login(dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '로그인에 성공했습니다.',
      result,
    };
  }
}
