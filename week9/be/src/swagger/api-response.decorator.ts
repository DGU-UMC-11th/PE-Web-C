import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ErrorCode } from '../exception/error-code';

// main.ts의 addBearerAuth에서 등록한 이름과 같아야 자물쇠 버튼과 연결됨
export const BEARER_AUTH = 'bearerAuth';

// 성공 응답 예시: 컨트롤러가 돌려주는 { isSuccess, code, message, result } 모양을 그대로 적음
export function ApiSuccessResponse(
  status: 200 | 201,
  message: string,
  result: unknown,
) {
  return ApiResponse({
    status,
    description: message,
    schema: {
      example: {
        isSuccess: true,
        code: `COMMON${status}`,
        message,
        result,
      },
    },
  });
}

type ErrorCodeKey = keyof typeof ErrorCode;

// 실패 응답 예시: error-code.ts 표에서 status, code, message를 읽어서 문서와 실제 응답이 어긋나지 않게 함
// 같은 상태 코드로 실패하는 경우가 여러 개면(예: 409 RATING409_1, FAVORITE409_1) 한 번에 넘겨서 예시를 나란히 보여 줌
export function ApiFailureResponse(...errorCodes: [ErrorCodeKey, ...ErrorCodeKey[]]) {
  const errors = errorCodes.map((key) => ErrorCode[key]);
  const status = errors[0].status;
  if (errors.some((error) => error.status !== status)) {
    throw new Error('ApiFailureResponse에는 같은 상태 코드의 실패만 넘겨주세요.');
  }

  const examples = Object.fromEntries(
    errors.map(({ code, message }) => [
      code,
      { value: { isSuccess: false, code, message, result: null } },
    ]),
  );

  return ApiResponse({
    status,
    description: errors.map(({ code, message }) => `${code} ${message}`).join(' / '),
    content: { 'application/json': { examples } },
  });
}

// ApiException이 아닌 실패(ValidationPipe 400, ConflictException 409 등)는 6주차 규칙대로 COMMON{상태 코드}로 나감
export function ApiCommonFailureResponse(status: 400 | 409, message: string) {
  const code = `COMMON${status}`;
  return ApiResponse({
    status,
    description: `${code} ${message}`,
    schema: {
      example: { isSuccess: false, code, message, result: null },
    },
  });
}

// 토큰이 필요한 API 표시: 자물쇠 + 공통 401 응답 (AUTH401_2~4)
export function ApiTokenRequired() {
  return applyDecorators(
    ApiBearerAuth(BEARER_AUTH),
    ApiResponse({
      status: 401,
      description:
        'AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰',
      schema: {
        example: {
          isSuccess: false,
          code: ErrorCode.AUTH_TOKEN_MISSING.code,
          message: ErrorCode.AUTH_TOKEN_MISSING.message,
          result: null,
        },
      },
    }),
  );
}
