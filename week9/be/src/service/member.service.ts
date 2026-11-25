import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Not, Repository } from 'typeorm';
import { CheckResponseDto } from '../dto/check-response.dto';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberInfoResponseDto } from '../dto/member-info-response.dto';
import { MemberResponseDto } from '../dto/member-response.dto';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto';
import { Member } from '../entity/member.entity';
import { apiException } from '../exception/error-code';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({ where: { nickname } });
    return { available: !exists };
  }

  async checkEmail(email: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({ where: { email } });
    return { available: !exists };
  }

  async signUp(dto: CreateMemberDto): Promise<MemberResponseDto> {
    if (await this.memberRepository.exists({ where: { email: dto.email } })) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    if (
      await this.memberRepository.exists({ where: { nickname: dto.nickname } })
    ) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    const savedMember = await this.memberRepository.save(
      this.memberRepository.create({
        email: dto.email,
        password: await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS),
        nickname: dto.nickname,
      }),
    );

    return MemberResponseDto.from(savedMember);
  }

  async getMyInfo(memberId: number): Promise<MemberInfoResponseDto> {
    const member = await this.findMember(memberId);
    return MemberInfoResponseDto.from(member);
  }

  async updateMyInfo(
    memberId: number,
    dto: MemberUpdateRequestDto,
  ): Promise<MemberInfoResponseDto> {
    const member = await this.findMember(memberId);

    // 내가 쓰던 닉네임은 그대로 저장할 수 있도록 나를 빼고 중복 확인
    const isDuplicated = await this.memberRepository.exists({
      where: { nickname: dto.nickname, memberId: Not(memberId) },
    });
    if (isDuplicated) {
      throw apiException('MEMBER_NICKNAME_DUPLICATED');
    }

    member.nickname = dto.nickname;
    const savedMember = await this.memberRepository.save(member);

    return MemberInfoResponseDto.from(savedMember);
  }

  private async findMember(memberId: number): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw apiException('MEMBER_NOT_FOUND');
    }
    return member;
  }
}
