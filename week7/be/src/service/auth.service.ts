import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { Member } from '../entity/member.entity';
import { apiException } from '../exception/error-code';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const member = await this.memberRepository.findOneBy({ email: dto.email });

    // 없는 이메일과 틀린 비밀번호를 같은 응답으로 묶어서 가입 여부를 숨김
    const isPasswordMatched =
      member !== null && (await bcrypt.compare(dto.password, member.password));

    if (!member || !isPasswordMatched) {
      throw apiException('AUTH_INVALID_CREDENTIALS');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: String(member.memberId),
      email: member.email,
    });

    return { nickname: member.nickname, accessToken };
  }
}
