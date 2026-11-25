import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request } from 'express';
import { apiException } from '../exception/error-code';

const BEARER_PREFIX = 'Bearer ';

interface AccessTokenPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;

    if (!header || !header.startsWith(BEARER_PREFIX)) {
      throw apiException('AUTH_TOKEN_MISSING');
    }

    const token = header.slice(BEARER_PREFIX.length);

    try {
      // 서명과 만료 시각을 같이 검증
      const payload =
        await this.jwtService.verifyAsync<AccessTokenPayload>(token);
      request['memberId'] = Number(payload.sub);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw apiException('AUTH_TOKEN_EXPIRED');
      }
      throw apiException('AUTH_TOKEN_INVALID');
    }

    return true;
  }
}
