import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginRequestDto } from '../dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
