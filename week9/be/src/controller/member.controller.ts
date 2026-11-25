import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto';
import { AuthGuard } from '../guard/auth.guard';
import { MemberService } from '../service/member.service';
import {
  ApiCommonFailureResponse,
  ApiFailureResponse,
  ApiSuccessResponse,
  ApiTokenRequired,
} from '../swagger/api-response.decorator';

const MY_INFO_EXAMPLE = {
  email: 'challenger@umc.com',
  nickname: '영화조아',
  createdAt: '2026-09-13T21:00:00.000Z',
};

@ApiTags('회원')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 고정 경로(me)를 변수 경로보다 먼저 선언
  @ApiOperation({
    summary: '내 정보 조회 (토큰 필요)',
    description: '토큰의 주인인 회원의 이메일, 닉네임, 가입일을 조회합니다.',
  })
  @ApiTokenRequired()
  @ApiSuccessResponse(200, '회원 정보를 조회했습니다.', MY_INFO_EXAMPLE)
  @ApiFailureResponse('MEMBER_NOT_FOUND')
  @Get('me')
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() request: Request) {
    const memberId = request['memberId'] as number;

    const result = await this.memberService.getMyInfo(memberId);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  @ApiOperation({
    summary: '내 정보 수정 (토큰 필요)',
    description:
      '토큰의 주인인 회원의 닉네임을 바꿉니다. 내가 쓰던 닉네임은 그대로 저장할 수 있습니다.',
  })
  @ApiTokenRequired()
  @ApiSuccessResponse(200, '회원 정보를 수정했습니다.', {
    ...MY_INFO_EXAMPLE,
    nickname: '영화매니아',
  })
  @ApiCommonFailureResponse(400, '닉네임은 2자 이상 12자 이하여야 합니다.')
  @ApiFailureResponse('MEMBER_NOT_FOUND')
  @ApiFailureResponse('MEMBER_NICKNAME_DUPLICATED')
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: Request,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const memberId = request['memberId'] as number;

    const result = await this.memberService.updateMyInfo(memberId, dto);
    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }

  // 중복 확인은 공통 응답 형식 없이 { available }만 돌려줌
  @ApiOperation({
    summary: '닉네임 중복 확인 (토큰 불필요)',
    description: '회원가입 전에 닉네임을 쓸 수 있는지 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용할 수 있으면 true',
    schema: { example: { available: true } },
  })
  @Get('nickname/:nickname')
  checkNickname(@Param('nickname') nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @ApiOperation({
    summary: '이메일 중복 확인 (토큰 불필요)',
    description: '회원가입 전에 이메일을 쓸 수 있는지 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용할 수 있으면 true',
    schema: { example: { available: true } },
  })
  @Get('email/:email')
  checkEmail(@Param('email') email: string) {
    return this.memberService.checkEmail(email);
  }

  @ApiOperation({
    summary: '회원가입 (토큰 불필요)',
    description:
      '이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
  })
  @ApiSuccessResponse(201, '회원가입에 성공했습니다.', {
    memberId: 1,
    email: 'challenger@umc.com',
    nickname: '영화조아',
  })
  @ApiCommonFailureResponse(
    400,
    '비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다.',
  )
  @ApiCommonFailureResponse(409, '이미 사용 중인 이메일입니다.')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);
    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '회원가입에 성공했습니다.',
      result,
    };
  }
}
