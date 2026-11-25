import { Member } from '../entity/member.entity';

export class MemberInfoResponseDto {
  email: string;
  nickname: string;
  createdAt: Date;

  // 엔티티를 그대로 내보내면 password까지 나가므로 필요한 값만 옮겨 담음
  static from(member: Member): MemberInfoResponseDto {
    return {
      email: member.email,
      nickname: member.nickname,
      createdAt: member.createdAt,
    };
  }
}
