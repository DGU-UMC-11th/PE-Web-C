export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export class MemberResponseError extends Error {}

export function getApiResult<T>(response: ApiResponse<T>): T {
  if (!response.isSuccess || response.result == null) {
    throw new MemberResponseError(response.message || "요청을 처리하지 못했어요.");
  }
  return response.result;
}
